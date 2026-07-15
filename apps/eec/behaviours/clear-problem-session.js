const {
  ORDERED_PROBLEM_ORDER,
  toArray
} = require('../../../utils/problem-utils');

const normaliseRoute = route => {
  if (!route || typeof route !== 'string') {
    return null;
  }

  return route.startsWith('/') ? route : `/${route}`;
};

const getProblemRoutes = steps => {
  const discoveredRoutes = new Set();
  const visited = new Set();

  const walkForkTargets = route => {
    const currentRoute = normaliseRoute(route);
    if (!currentRoute || visited.has(currentRoute) || !steps[currentRoute]) {
      return;
    }

    visited.add(currentRoute);
    discoveredRoutes.add(currentRoute);

    const forks = Array.isArray(steps[currentRoute].forks) ? steps[currentRoute].forks : [];
    forks.forEach(fork => {
      if (fork && fork.target) {
        walkForkTargets(fork.target);
      }
    });
  };

  ORDERED_PROBLEM_ORDER.forEach(problem => {
    walkForkTargets(problem.target);
  });

  return discoveredRoutes;
};

const getProblemFieldsToClear = steps => {
  const fields = new Set();

  getProblemRoutes(steps).forEach(route => {
    const routeFields = steps[route] && Array.isArray(steps[route].fields)
      ? steps[route].fields
      : [];

    routeFields.forEach(fieldName => fields.add(fieldName));
  });

  return fields;
};

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const steps = req.form && req.form.options ? req.form.options.steps : null;
    const selectedProblems = toArray(req.sessionModel.get('problem'));

    if (steps && selectedProblems.length === 0) {
      getProblemFieldsToClear(steps).forEach(fieldName => {
        req.sessionModel.unset(fieldName);
      });

      // Keep edit snapshots in sync when no problem journey is selected.
      req.sessionModel.unset('problem-selection-before-edit');
      req.sessionModel.unset('problem-selection-current-edit');
      req.sessionModel.unset('problem-values-before-edit');
    }

    return super.locals(req, res);
  }
};
