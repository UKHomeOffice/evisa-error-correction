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

  return PROBLEM_ORDER_BY_KEY[key];
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

const getFieldsForProblemKey = (req, problemKey) => {
  const targetRoute = PROBLEM_KEY_TO_TARGET_ROUTE[problemKey];
  const steps = req.form && req.form.options ? req.form.options.steps : null;
  const sessionSteps = toArray(req.sessionModel.get('steps'));

  if (targetRoute && steps && steps[targetRoute] && Array.isArray(steps[targetRoute].fields)) {
    return steps[targetRoute].fields;
  }

  if (targetRoute && steps) {
    const matchingSessionRoute = sessionSteps.find(stepRoute => {
      const route = typeof stepRoute === 'string' ? stepRoute : '';
      return route === targetRoute
        || route === `${targetRoute}/edit`
        || route.startsWith(`${targetRoute}/edit/`);
    });

    if (matchingSessionRoute && steps[targetRoute] && Array.isArray(steps[targetRoute].fields)) {
      return steps[targetRoute].fields;
    }
  }

  return [];
};

module.exports = {
  ORDERED_PROBLEM_ORDER,
  PROBLEM_ORDER_BY_KEY,
  PROBLEM_ROUTE_TO_KEY,
  getProblemOrder,
  toArray,
  getFieldsForProblemKey
};
