const { PROBLEM_ORDER } = require('./problem-order');

// Fast lookup: problem key -> canonical order index.
const PROBLEM_ORDER_BY_KEY = PROBLEM_ORDER.reduce((acc, item) => {
  acc[item.key] = item.order;
  return acc;
}, {});

// Fast lookup: slash-prefixed route -> problem key.
const PROBLEM_ROUTE_TO_KEY = PROBLEM_ORDER.reduce((acc, item) => {
  const route = item.target.startsWith('/') ? item.target : `/${item.target}`;
  acc[route] = item.key;
  return acc;
}, {});

// Internal lookup: problem key -> slash-prefixed target route.
const PROBLEM_KEY_TO_TARGET_ROUTE = PROBLEM_ORDER.reduce((acc, item) => {
  const route = item.target.startsWith('/') ? item.target : `/${item.target}`;
  acc[item.key] = route;
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

// Resolve configured fields for the problem's canonical route.
const getFieldsForProblemKey = (req, problemKey) => {
  const targetRoute = PROBLEM_KEY_TO_TARGET_ROUTE[problemKey];
  const steps = req.form?.options?.steps;

  if (targetRoute && steps && steps[targetRoute] && Array.isArray(steps[targetRoute].fields)) {
    return steps[targetRoute].fields;
  }
  return [];
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
  getFieldsForProblemKey
};
