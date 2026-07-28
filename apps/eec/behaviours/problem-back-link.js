/*
 * Problem Back Link behavior (full logic overview)
 *
 * Purpose:
 * Provide deterministic back-link navigation for the problem sub-journey,
 * based on selected problem order rather than only browser/history defaults.
 *
 * Scope:
 * Applies only to problem-journey routes:
 * - /your-evisa-details
 * - any route mapped in PROBLEM_ROUTE_TO_KEY
 * Non-problem routes keep HOF default back-link behavior.
 *
 * Decision rules:
 * 1) On /your-evisa-details:
 *    back-link goes to the last selected problem step in canonical order.
 * 2) On any problem step:
 *    back-link goes to the previous selected problem step in canonical order.
 * 3) If no matching previous/last selected step exists:
 *    back-link falls back to problem (problem selection page).
 * 4) If route is outside the problem journey:
 *    return null so framework defaults apply.
 *
 * Integration with HOF:
 * - This behavior sets res.locals.backLink to a route fragment when scoped.
 * - It then returns super.getBackLink(req, res) so HOF performs final
 *   formatting (leading slash, edit suffix handling, etc.).
 */
const {
  PROBLEM_ORDER,
  PROBLEM_ROUTE_TO_KEY,
  getProblemOrder,
  toArray,
  normaliseRoute
} = require('../../../utils/problem-utils');

// Compute the back-link target for routes inside the problem journey.
const getProblemBackLinkForRoute = (route, req) => {
  const currentRoute = normaliseRoute(route);
  const currentSelection = toArray(req.sessionModel.get('problem'));

  const selectedSet = new Set(currentSelection);

  if (currentRoute === '/your-evisa-details' && currentSelection.length > 0) {
    const lastSelected = PROBLEM_ORDER
      .filter(problem => selectedSet.has(problem.key))
      .pop();

    return lastSelected ? lastSelected.target : 'problem';
  }

  const currentKey = PROBLEM_ROUTE_TO_KEY[currentRoute];
  if (!currentKey) {
    return null;
  }

  const currentOrder = getProblemOrder(currentKey);

  const previousSelected = PROBLEM_ORDER
    .filter(problem => problem.order < currentOrder && selectedSet.has(problem.key))
    .pop();

  if (previousSelected) {
    return previousSelected.target;
  }

  return 'problem';
};

const isProblemRelatedRoute = route => {
  const currentRoute = normaliseRoute(route);
  if (!currentRoute) {
    return false;
  }

  // Keep custom back-link logic strictly scoped to problem journey pages.
  return currentRoute === '/your-evisa-details'
    || Boolean(PROBLEM_ROUTE_TO_KEY[currentRoute]);
};

// Request-level wrapper around route/session state.
const getProblemBackLink = req => {
  const route = req.form && req.form.options ? normaliseRoute(req.form.options.route) : null;
  if (!route) {
    return null;
  }

  return getProblemBackLinkForRoute(route, req);
};

module.exports = superclass => class extends superclass {
  // Override controller back-link resolution for problem-journey routes.
  getBackLink(req, res) {
    const route = req.form && req.form.options ? normaliseRoute(req.form.options.route) : null;

    if (isProblemRelatedRoute(route)) {
      const backLink = getProblemBackLink(req);
      if (backLink) {
        res.locals.backLink = backLink;
      }
    }

    return super.getBackLink(req, res);
  }
};
