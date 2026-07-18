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
 * - Treat an existing edit snapshot as active edit context.
 *   This keeps restoration active after back-link/continue flows that may
 *   return on a non-edit URL.
 * - Only restore values for problems that are still selected.
 *   If a problem was removed from the edit selection, its stored values should
 *   stay cleared so the summary cannot show stale data.
 * - Never overwrite a field that already has a value.
 *   This avoids clobbering any value the user re-entered during the edit.
 * - Clear the edit-only snapshot keys on normal problem-selection submits.
 *   That prevents old edit snapshots from leaking into later non-edit flows.
 */
const { toArray, hasFieldValue, getFieldsForProblemKey } = require('../../../utils/problem-utils');

const getSnapshotValue = (req, fieldName, overrides) => {
  if (Object.prototype.hasOwnProperty.call(overrides, fieldName)) {
    return overrides[fieldName];
  }

  return req.sessionModel.get(fieldName);
};

const snapshotProblemValues = (req, problemKeys, overrides = {}) => problemKeys.reduce((acc, problemKey) => {
  const fields = getFieldsForProblemKey(req, problemKey);

  acc[problemKey] = fields.reduce((fieldAcc, fieldName) => {
    fieldAcc[fieldName] = getSnapshotValue(req, fieldName, overrides);
    return fieldAcc;
  }, {});
  return acc;
}, {});

// Edit mode can be inferred from URL params or from an active edit snapshot.
const isActiveEditContext = req => {
  const params = req.params || {};
  if (params.edit || params.action === 'edit') {
    return true;
  }

  const valuesBeforeEdit = req.sessionModel.get('problem-values-before-edit');
  return Boolean(valuesBeforeEdit && Object.keys(valuesBeforeEdit).length > 0);
};

module.exports = superclass => class extends superclass {
  saveValues(req, res, next) {
    const isEditJourney = isActiveEditContext(req);
    const formValues = req.form && req.form.values ? req.form.values : {};
    const isProblemSelectionSubmit = Object.prototype.hasOwnProperty.call(formValues, 'problem');

    const previousProblemSelection = toArray(req.sessionModel.get('problem'));

    if (isEditJourney) {
      req.sessionModel.set('problem-selection-before-edit', previousProblemSelection);

      const currentProblemSelection = isProblemSelectionSubmit
        ? toArray(formValues.problem)
        : previousProblemSelection;

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
    const isEditJourney = isActiveEditContext(req);

    this.emit('complete', req, res);

    if (isEditJourney) {
      const currentSelection = toArray(req.sessionModel.get('problem'));
      const selectedProblems = new Set(currentSelection);
      const valuesBeforeEdit = req.sessionModel.get('problem-values-before-edit') || {};

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

      // Keep a rolling snapshot so subsequent edit submits preserve the latest values.
      req.sessionModel.set('problem-values-before-edit', snapshotProblemValues(req, currentSelection));
    }

    res.redirect(this.getNextStep(req, res));
  }
};
