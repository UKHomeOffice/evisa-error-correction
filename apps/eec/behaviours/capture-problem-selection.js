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
 *   This delegates to `clearProblemSessionState` so problem fields and edit
 *   snapshot keys are reset together.
 * - Clear edit snapshot keys on non-edit problem-selection submits.
 *   That prevents old edit snapshots from leaking into later non-edit flows.
 * - On any problem-selection submit (edit or non-edit), if accompanying-adult
 *   details is not selected, internal adult fork steps are removed from
 *   session progress.
 * - In edit success, rebuild problem-related session steps in canonical
 *   problem order and keep non-problem steps untouched.
 */
const {
  PROBLEM_ORDER,
  toArray,
  hasFieldValue,
  getFieldsForProblemKey,
  isEditJourney
} = require('../../../utils/problem-utils');
const { clearProblemSessionState } = require('./clear-problem-session');

const getSnapshotValue = (req, fieldName, overrides) => {
  if (Object.prototype.hasOwnProperty.call(overrides, fieldName)) {
    return overrides[fieldName];
  }

  return req.sessionModel.get(fieldName);
};

const snapshotProblemValues = (req, problemKeys, overrides) => problemKeys.reduce((acc, problemKey) => {
  const fields = getFieldsForProblemKey(req, problemKey);

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

// Remove adult internal fork steps when accompanying-adult-details is not selected.
const removeAdultAccompanyingInternalStepsIfUnselected = (req, selectedProblems) => {
  if (selectedProblems.has('problem-accompanying-adult-details')) {
    return;
  }

  removeJourneySteps(req, [
    '/correct-details-adult-accompanying',
    '/correct-passport-number'
  ]);
};

// Rebuild only the problem-related portion of session steps in canonical order.
// Non-problem steps retain their existing relative order.
const restoreSelectedProblemJourneySteps = (req, selectedProblems) => {
  const selectedProblemSteps = [];

  PROBLEM_ORDER.forEach(problem => {
    if (!selectedProblems.has(problem.key)) {
      return;
    }

    const route = problem.target.startsWith('/') ? problem.target : `/${problem.target}`;
    selectedProblemSteps.push(route);

    if (problem.key !== 'problem-accompanying-adult-details') {
      return;
    }

    const adultSelection = req.sessionModel.get('how-many-adults');
    if (adultSelection === '1-adult') {
      selectedProblemSteps.push('/correct-details-adult-accompanying');
    }

    if (adultSelection === '2-adults') {
      selectedProblemSteps.push('/correct-passport-number');
    }
  });

  const allProblemRoutes = PROBLEM_ORDER.map(problem =>
    problem.target.startsWith('/') ? problem.target : `/${problem.target}`
  );
  allProblemRoutes.push('/correct-details-adult-accompanying', '/correct-passport-number');

  const problemRouteSet = new Set(allProblemRoutes);
  const currentSteps = toArray(req.sessionModel.get('steps'));
  const nonProblemSteps = currentSteps.filter(step => !problemRouteSet.has(step));
  const orderedUniqueProblemSteps = selectedProblemSteps.filter((step, index, arr) => arr.indexOf(step) === index);

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
