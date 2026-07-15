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
 * - Only snapshot/restore when the user submits the problem selection step.
 *   This keeps the behavior scoped to the one place where HOF can invalidate
 *   problem forks and clear downstream fields.
 * - Only restore values for problems that are still selected.
 *   If a problem was removed from the edit selection, its stored values should
 *   stay cleared so the summary cannot show stale data.
 * - Never overwrite a field that already has a value.
 *   This avoids clobbering any value the user re-entered during the edit.
 * - Clear the edit-only snapshot keys on normal problem-selection submits.
 *   That prevents old edit snapshots from leaking into later non-edit flows.
 */
const { toArray, getFieldsForProblemKey } = require('../../../utils/problem-utils');

module.exports = superclass => class extends superclass {
  saveValues(req, res, next) {
    const params = req.params || {};
    const isEditJourney = Boolean(params.edit || params.action === 'edit');
    const formValues = req.form && req.form.values ? req.form.values : {};
    const isProblemSelectionSubmit = Object.prototype.hasOwnProperty.call(formValues, 'problem');

    const previousProblemSelection = toArray(req.sessionModel.get('problem'));

    if (isEditJourney && isProblemSelectionSubmit) {
      req.sessionModel.set('problem-selection-before-edit', previousProblemSelection);
      req.sessionModel.set('problem-selection-current-edit', toArray(formValues.problem));

      const valuesBeforeEdit = previousProblemSelection.reduce((acc, problemKey) => {
        const fields = getFieldsForProblemKey(req, problemKey);

        acc[problemKey] = fields.reduce((fieldAcc, fieldName) => {
          fieldAcc[fieldName] = req.sessionModel.get(fieldName);
          return fieldAcc;
        }, {});
        return acc;
      }, {});

      req.sessionModel.set('problem-values-before-edit', valuesBeforeEdit);
    } else if (!isEditJourney && isProblemSelectionSubmit) {
      req.sessionModel.unset('problem-selection-before-edit');
      req.sessionModel.unset('problem-selection-current-edit');
      req.sessionModel.unset('problem-values-before-edit');
    }

    return super.saveValues(req, res, next);
  }

  successHandler(req, res) {
    const params = req.params || {};
    const isEditJourney = Boolean(params.edit || params.action === 'edit');

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

          if ((currentValue === undefined || currentValue === null || currentValue === '') && previousValue) {
            req.sessionModel.set(fieldName, previousValue);
          }
        });
      });
    }

    res.redirect(this.getNextStep(req, res));
  }
};
