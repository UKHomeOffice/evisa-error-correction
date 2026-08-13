/*
 * Build the next problem fork for the current point in the journey.
 *
 * The fork list is ordered from the canonical problem order, but only the
 * first eligible later problem should match. It follows the current selected
 * problems in `problem`.
 *
 * For selected problems after the current step:
 * - Non-edit journeys route to the next selected problem in configured order.
 * - Edit journeys route to the first selected problem whose owned fields are
 *   missing. Field ownership is resolved via `getFieldsForProblemKey` with
 *   `internalRoutes: 'selected'`, so only the active internal branch is
 *   considered for selector-based problems.
 *   If all selected problems are complete, no fork matches and HOF falls back
 *   to `step.next`.
 *
 * Forks are emitted with `continueOnEdit: true` so this check still runs in
 * edit journeys, while non-edit journeys continue using normal selected-
 * problem progression.
 *
 * When there is no eligible later problem, HOF falls back to `step.next`.
 */
const {
  PROBLEM_ORDER,
  getProblemOrder,
  toArray,
  isEditJourney,
  hasFieldValue,
  getFieldsForProblemKey
} = require('./problem-utils');

// Current problem selection.
const getProblemSelection = req => toArray(req.sessionModel.get('problem'));

const problemHasMissingOwnedFields = (req, problemKey) => {
  const fields = getFieldsForProblemKey(req, problemKey, { internalRoutes: 'selected' });

  return fields.some(fieldName => !hasFieldValue(req.sessionModel.get(fieldName)));
};

// Find the next selected problem after the current step.
// - Non-edit: first later selected problem.
// - Edit: first later selected problem with missing owned fields.
const nextSelectedProblem = (req, currentProblemKey) => {
  const selected = new Set(getProblemSelection(req));
  const afterOrder = getProblemOrder(currentProblemKey);
  const editJourney = isEditJourney(req);

  for (const problem of PROBLEM_ORDER) {
    if (problem.order <= afterOrder) {
      continue;
    }

    if (!selected.has(problem.key)) {
      continue;
    }

    if (!editJourney) {
      return problem.target;
    }

    if (problemHasMissingOwnedFields(req, problem.key)) {
      return problem.target;
    }
  }

  return null;
};

// Only one fork should match: the next selected problem target.
const isNextProblemTarget = (req, target, currentProblemKey) => nextSelectedProblem(req, currentProblemKey) === target;

// Build HOF fork entries for problems that appear later in the configured order.
const buildProblemForks = (currentProblemKey = null) => {
  const afterOrder = getProblemOrder(currentProblemKey);
  return PROBLEM_ORDER.filter(problem => problem.order > afterOrder).map(problem => ({
    target: problem.target,
    continueOnEdit: true,
    condition: req => isNextProblemTarget(req, problem.target, currentProblemKey)
  }));
};

module.exports = {
  buildProblemForks
};
