const { PROBLEM_ORDER } = require('./problem-order');

const ORDERED_PROBLEM_ORDER = PROBLEM_ORDER.slice().sort((a, b) => a.order - b.order);

const PROBLEM_ORDER_BY_KEY = ORDERED_PROBLEM_ORDER.reduce((acc, item) => {
  acc[item.key] = item.order;
  return acc;
}, {});

const PROBLEM_ROUTE_TO_KEY = ORDERED_PROBLEM_ORDER.reduce((acc, item) => {
  const route = item.target.startsWith('/') ? item.target : `/${item.target}`;
  acc[route] = item.key;
  return acc;
}, {});

const PROBLEM_KEY_TO_TARGET_ROUTE = ORDERED_PROBLEM_ORDER.reduce((acc, item) => {
  const route = item.target.startsWith('/') ? item.target : `/${item.target}`;
  acc[item.key] = route;
  return acc;
}, {});

const getProblemOrder = key => {
  if (!key) {
    return 0;
  }

  return PROBLEM_ORDER_BY_KEY[key] ?? 0;
};

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

const normaliseRoute = route => {
  if (!route || typeof route !== 'string') {
    return null;
  }

  return route.startsWith('/') ? route : `/${route}`;
};

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

const getFieldsForProblemKey = (req, problemKey) => {
  const targetRoute = PROBLEM_KEY_TO_TARGET_ROUTE[problemKey];
  const steps = req.form?.options?.steps;

  if (targetRoute && steps && steps[targetRoute] && Array.isArray(steps[targetRoute].fields)) {
    return steps[targetRoute].fields;
  }
  return [];
};

module.exports = {
  ORDERED_PROBLEM_ORDER,
  PROBLEM_ORDER_BY_KEY,
  PROBLEM_ROUTE_TO_KEY,
  getProblemOrder,
  toArray,
  normaliseRoute,
  hasFieldValue,
  getFieldsForProblemKey
};
