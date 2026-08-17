const { PROBLEM_ORDER } = require('./problem-order');

// Fast lookup: problem key -> canonical order index.
const PROBLEM_ORDER_BY_KEY = PROBLEM_ORDER.reduce((acc, item) => {
  acc[item.key] = item.order;
  return acc;
}, {});

// Fast lookup: slash-prefixed route -> problem key.
const PROBLEM_ROUTE_TO_KEY = PROBLEM_ORDER.reduce((acc, item) => {
  acc[item.target] = item.key;
  return acc;
}, {});

// Internal lookup: problem key -> slash-prefixed target route.
const PROBLEM_KEY_TO_TARGET_ROUTE = PROBLEM_ORDER.reduce((acc, item) => {
  acc[item.key] = item.target;
  return acc;
}, {});

// Internal lookup: problem key -> optional internal fork routes.
const PROBLEM_KEY_TO_INTERNAL_ROUTES = PROBLEM_ORDER.reduce((acc, item) => {
  acc[item.key] = item.internalRoutes || null;
  return acc;
}, {});

// Internal lookup: problem key -> optional selector field for internal routes.
const PROBLEM_KEY_TO_INTERNAL_ROUTE_SELECTOR = PROBLEM_ORDER.reduce((acc, item) => {
  acc[item.key] = item.internalRouteSelector || null;
  return acc;
}, {});

// Return 0 for unknown/missing keys so order comparisons remain safe.
const getProblemOrder = key => {
  if (!key) {
    return 0;
  }

  return PROBLEM_ORDER_BY_KEY[key] ?? 0;
};

// Normalize session/form values into an array shape.
const toArray = value => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }

  return [value];
};

// Ensure route-like values are slash-prefixed, otherwise return null.
const normaliseRoute = route => {
  if (!route || typeof route !== 'string') {
    return null;
  }

  return route.startsWith('/') ? route : `/${route}`;
};

// Detect edit journey mode from supported route params.
const isEditJourney = req => {
  const params = req.params || {};
  return Boolean(params.edit || params.action === 'edit');
};

// Generic check used before restoring or clearing field values.
const hasFieldValue = value => {
  if (value === undefined || value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  return true;
};

// Clear a list of fields from session, de-duplicating names first.
const clearFields = (req, fields) => {
  Array.from(new Set(fields)).forEach(fieldName => req.sessionModel.unset(fieldName));
};
/**
 * Resolve internal routes for a problem key from PROBLEM_ORDER metadata.
 *
 * The metadata can be either a flat array of routes or a selector-based map
 * of branch names to routes. In `all` mode the function returns every internal
 * route configured for the problem. In `selected` mode it returns only the
 * branch that matches the current selector value from `req.sessionModel`.
 *
 * @param {object} req - HOF request object.
 * @param {string} problemKey - Problem key from PROBLEM_ORDER.
 * @param {'all'|'selected'} [internalRoutesMode='all'] - Route resolution mode.
 * @returns {string[]} Normalized slash-prefixed internal routes.
 */
const getInternalRoutesForProblemKey = (req, problemKey, internalRoutesMode = 'all') => {
  const problemInternalRoutes = PROBLEM_KEY_TO_INTERNAL_ROUTES[problemKey];

  if (!problemInternalRoutes) {
    return [];
  }

  // Support the simple array form: internalRoutes: ['/route-a', '/route-b'].
  // Current `PROBLEM_ORDER` entries use selector-based maps, but this keeps the helper compatible
  // with routes that do not need branching.
  if (Array.isArray(problemInternalRoutes)) {
    return problemInternalRoutes.map(normaliseRoute).filter(Boolean);
  }

  if (internalRoutesMode === 'selected') {
    const selectorField = PROBLEM_KEY_TO_INTERNAL_ROUTE_SELECTOR[problemKey];
    const selectedValue = selectorField ? req.sessionModel.get(selectorField) : null;
    const selectedRoutes = problemInternalRoutes[selectedValue] || [];

    return selectedRoutes.map(normaliseRoute).filter(Boolean);
  }

  return Object.values(problemInternalRoutes)
    .flat()
    .map(normaliseRoute)
    .filter(Boolean);
};

// Resolve and flatten configured fields for a list of routes.
const getFieldsForRoutes = (req, routes) => {
  const steps = req.form?.options?.steps;

  if (!steps) {
    return [];
  }

  const fields = routes.reduce((acc, route) => {
    const routeFields = Array.isArray(steps[route]?.fields) ? steps[route].fields : [];
    return acc.concat(routeFields);
  }, []);

  return Array.from(new Set(fields));
};

// Resolve configured fields for the problem's canonical route.
const getFieldsForProblemKey = (req, problemKey, options = {}) => {
  const targetRoute = PROBLEM_KEY_TO_TARGET_ROUTE[problemKey];
  if (!targetRoute) {
    throw new Error(`Unknown problem key: ${problemKey}`);
  }
  const internalRoutes = getInternalRoutesForProblemKey(req, problemKey, options.internalRoutes);

  const routes = [targetRoute, ...internalRoutes].filter(Boolean);
  return getFieldsForRoutes(req, routes);
};

module.exports = {
  PROBLEM_ORDER,
  PROBLEM_ORDER_BY_KEY,
  PROBLEM_ROUTE_TO_KEY,
  getProblemOrder,
  toArray,
  normaliseRoute,
  isEditJourney,
  hasFieldValue,
  clearFields,
  getFieldsForProblemKey,
  getFieldsForRoutes,
  getInternalRoutesForProblemKey
};
