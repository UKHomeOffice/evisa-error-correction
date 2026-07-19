/*
 * Clear problem journey session state when no problems are selected.
 *
 * Field collection rules:
 * - Include fields from each canonical problem target route.
 * - Include fields from direct forks of each problem target route.
 *
 * When no problem is selected, this behavior clears those field values and
 * resets edit snapshot keys used by capture/restore helpers.
 */
const {
  ORDERED_PROBLEM_ORDER,
  getFieldsForProblemKey,
  normaliseRoute,
  toArray
} = require('../../../utils/problem-utils');

const shouldClearProblemState = req => toArray(req.sessionModel.get('problem')).length === 0;

const addForkedRouteFields = (steps, route, fields) => {
  const currentRoute = normaliseRoute(route);
  if (!currentRoute || !steps[currentRoute]) {
    return;
  }

  const forks = Array.isArray(steps[currentRoute].forks)
    ? steps[currentRoute].forks
    : [];

  forks.forEach(fork => {
    const forkRoute = normaliseRoute(fork && fork.target);
    if (!forkRoute || !steps[forkRoute]) {
      return;
    }

    const forkFields = Array.isArray(steps[forkRoute].fields)
      ? steps[forkRoute].fields
      : [];
    forkFields.forEach(fieldName => fields.add(fieldName));
  });
};

// Build the unique set of problem-related fields that should be unset.
const getProblemFieldsToClear = req => {
  const fields = new Set();
  const steps = req.form?.options?.steps;

  ORDERED_PROBLEM_ORDER.forEach(problem => {
    const routeFields = getFieldsForProblemKey(req, problem.key);
    routeFields.forEach(fieldName => fields.add(fieldName));

    if (steps) {
      addForkedRouteFields(steps, problem.target, fields);
    }
  });

  return fields;
};

// Clear problem fields and edit snapshot keys in one shared place.
const clearProblemSessionState = req => {
  getProblemFieldsToClear(req).forEach(fieldName => {
    req.sessionModel.unset(fieldName);
  });

  req.sessionModel.unset('problem-selection-before-edit');
  req.sessionModel.unset('problem-selection-current-edit');
  req.sessionModel.unset('problem-values-before-edit');
};

const behaviour = superclass => class extends superclass {
  locals(req, res) {
    if (shouldClearProblemState(req)) {
      clearProblemSessionState(req);
    }

    return super.locals(req, res);
  }
};

module.exports = behaviour;
module.exports.clearProblemSessionState = clearProblemSessionState;
