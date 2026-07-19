/*
 * Clear problem journey session state when no problems are selected.
 *
 * This behavior gathers fields from each canonical problem route and also
 * includes fields from that route's direct fork targets. When the submitted
 * problem selection is empty, it unsets those field values and clears edit
 * snapshot keys used by the edit journey helpers.
 */
const {
  ORDERED_PROBLEM_ORDER,
  getFieldsForProblemKey,
  toArray
} = require('../../../utils/problem-utils');

const shouldClearProblemState = req => toArray(req.sessionModel.get('problem')).length === 0;

const normaliseRoute = route => {
  if (!route || typeof route !== 'string') {
    return null;
  }

  return route.startsWith('/') ? route : `/${route}`;
};

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

module.exports = superclass => class extends superclass {
  locals(req, res) {
    if (shouldClearProblemState(req)) {
      getProblemFieldsToClear(req).forEach(fieldName => {
        req.sessionModel.unset(fieldName);
      });

      req.sessionModel.unset('problem-selection-before-edit');
      req.sessionModel.unset('problem-selection-current-edit');
      req.sessionModel.unset('problem-values-before-edit');
    }

    return super.locals(req, res);
  }
};
