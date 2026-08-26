/*
 * Preserve problem-owned field values across edit submissions.
 *
 * When a user changes the selected problem(s) in an edit journey, HOF can
 * invalidate downstream forks and clear fields that belong to the problem
 * steps. This behavior snapshots the previous values before completion and
 * restores them after HOF has finished its normal invalidation pass.
 *
 * Session keys:
 * - problem-selection-before-edit: selection before the edit submit
 * - problem-selection-current-edit: selection submitted in the edit
 * - problem-values-before-edit: field snapshot for the previously selected
 *   problems
 *
 * Rules:
 * - Snapshot/restore on any edit submit.
 *   In edit mode, HOF can invalidate downstream steps when a page completes,
 *   so later selected problem values need preserving regardless of which
 *   problem page is being edited.
 * - Edit context is determined only from URL params (`edit` or `action=edit`).
 *   Existing snapshot data alone does not trigger restore logic.
 * - Only restore values for problems that are still selected.
 *   If a problem was removed from the edit selection, its stored values should
 *   stay cleared so the summary cannot show stale data.
 * - Never overwrite a field that already has a value.
 *   This avoids clobbering any value the user re-entered during the edit.
 * - Clear all problem state when previous selection is empty.
 *   This delegates to shared helper `clearProblemSessionState`
 *   (utils/clear-problem-session-state.js) so problem fields and edit snapshot
 *   keys are reset together.
 * - Clear edit snapshot keys on non-edit problem-selection submits.
 *   That prevents old edit snapshots from leaking into later non-edit flows.
 * - On any problem-selection submit (edit or non-edit), if accompanying-adult
 *   details is not selected, its internal routes are cleared and removed from
 *   session progress.
 * - In edit success, rebuild problem-related session steps in canonical
 *   problem order using problem metadata (including selected internal routes),
 *   and keep non-problem steps untouched.
 */
const {
  PROBLEM_ORDER,
  toArray,
  normaliseRoute,
  hasFieldValue,
  clearFields,
  getFieldsForProblemKey,
  getFieldsForRoutes,
  getInternalRoutesForProblemKey,
  isEditJourney
} = require('../../../utils/problem-utils');
const { clearProblemSessionState } = require('../../../utils/clear-problem-session-state');

const getSnapshotValue = (req, fieldName, overrides) => {
  if (Object.prototype.hasOwnProperty.call(overrides, fieldName)) {
    return overrides[fieldName];
  }

  return req.sessionModel.get(fieldName);
};

const snapshotProblemValues = (req, problemKeys, overrides) => problemKeys.reduce((acc, problemKey) => {
  const fields = getFieldsForProblemKey(req, problemKey, { internalRoutes: 'selected' });

  acc[problemKey] = fields.reduce((fieldAcc, fieldName) => {
    fieldAcc[fieldName] = getSnapshotValue(req, fieldName, overrides);
    return fieldAcc;
  }, {});
  return acc;
}, {});

const removeJourneySteps = (req, stepsToRemove) => {
  const removeSet = new Set(stepsToRemove);
  const currentSteps = toArray(req.sessionModel.get('steps'));
  const nextSteps = currentSteps.filter(step => !removeSet.has(step));

  req.sessionModel.set('steps', nextSteps);
};

// Remove accompanying-adult internal routes when that problem is no longer selected.
// This handles partial deselection (some problems still selected), where we must
// clear orphaned internal-step fields and remove their routes from session steps.
// Route values are resolved from problem metadata via getInternalRoutesForProblemKey.
const removeAdultAccompanyingInternalStepsIfUnselected = (req, selectedProblems) => {
  if (selectedProblems.has('problem-accompanying-adult-details')) {
    return;
  }

  const internalAdultRoutes = getInternalRoutesForProblemKey(req, 'problem-accompanying-adult-details');

  clearFields(req, getFieldsForRoutes(req, internalAdultRoutes));

  removeJourneySteps(req, internalAdultRoutes);
};

// Rebuild only the problem-related portion of session steps in canonical order.
// Non-problem steps retain their existing relative order.
const restoreSelectedProblemJourneySteps = (req, selectedProblems) => {
  const selectedProblemSteps = PROBLEM_ORDER.reduce((acc, problem) => {
    if (!selectedProblems.has(problem.key)) {
      return acc;
    }

    const route = normaliseRoute(problem.target);
    if (!route) {
      return acc;
    }

    acc.push(route, ...getInternalRoutesForProblemKey(req, problem.key, 'selected'));
    return acc;
  }, []);

  const allProblemRoutes = PROBLEM_ORDER.flatMap(problem => {
    const targetRoute = normaliseRoute(problem.target);
    const internalRoutes = getInternalRoutesForProblemKey(req, problem.key);

    return targetRoute ? [targetRoute, ...internalRoutes] : internalRoutes;
  });

  const problemRouteSet = new Set(allProblemRoutes);
  const currentSteps = toArray(req.sessionModel.get('steps'));
  const nonProblemSteps = currentSteps.filter(step => !problemRouteSet.has(step));
  const orderedUniqueProblemSteps = Array.from(new Set(selectedProblemSteps));

  req.sessionModel.set('steps', nonProblemSteps.concat(orderedUniqueProblemSteps));
};

module.exports = superclass => class extends superclass {
  saveValues(req, res, next) {
    const editJourney = isEditJourney(req);
    const formValues = req.form && req.form.values ? req.form.values : {};
    const isProblemSelectionSubmit = Object.prototype.hasOwnProperty.call(formValues, 'problem');
    const previousProblemSelection = toArray(req.sessionModel.get('problem'));
    const currentProblemSelection = isProblemSelectionSubmit
      ? toArray(formValues.problem)
      : previousProblemSelection;

    if (previousProblemSelection.length === 0) {
      clearProblemSessionState(req);
    }

    if (isProblemSelectionSubmit) {
      removeAdultAccompanyingInternalStepsIfUnselected(
        req,
        new Set(currentProblemSelection)
      );
    }

    if (editJourney) {
      req.sessionModel.set('problem-selection-before-edit', previousProblemSelection);
      req.sessionModel.set('problem-selection-current-edit', currentProblemSelection);

      const latestValues = snapshotProblemValues(
        req,
        currentProblemSelection,
        formValues
      );
      req.sessionModel.set('problem-values-before-edit', latestValues);
    } else if (isProblemSelectionSubmit) {
      req.sessionModel.unset('problem-selection-before-edit');
      req.sessionModel.unset('problem-selection-current-edit');
      req.sessionModel.unset('problem-values-before-edit');
    }

    return super.saveValues(req, res, next);
  }

  successHandler(req, res) {
    const editJourney = isEditJourney(req);

    this.emit('complete', req, res);

    if (editJourney) {
      const currentSelection = toArray(req.sessionModel.get('problem'));
      const selectedProblems = new Set(currentSelection);
      const valuesBeforeEdit = req.sessionModel.get('problem-values-before-edit') || {};

      removeAdultAccompanyingInternalStepsIfUnselected(req, selectedProblems);

      Object.keys(valuesBeforeEdit).forEach(problemKey => {
        if (!selectedProblems.has(problemKey)) {
          return;
        }

        const fields = valuesBeforeEdit[problemKey] || {};
        Object.keys(fields).forEach(fieldName => {
          const previousValue = fields[fieldName];
          const currentValue = req.sessionModel.get(fieldName);

          if (!hasFieldValue(currentValue) && hasFieldValue(previousValue)) {
            req.sessionModel.set(fieldName, previousValue);
          }
        });
      });

      restoreSelectedProblemJourneySteps(req, selectedProblems);
    }

    res.redirect(this.getNextStep(req, res));
  }
};
