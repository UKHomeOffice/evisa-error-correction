/*
 * Build the next problem fork for the current point in the journey.
 *
 * The fork list is ordered from the canonical problem order, but only the
 * first eligible later problem should match. It follows the current selected
 * problems in `problem`.
 *
 * For selected problems after the current step, routing returns the first
 * selected problem whose owned fields are missing. If all selected problems
 * are complete, no fork matches and HOF falls back to `step.next`.
 *
 * Forks are emitted with `continueOnEdit: true` so this check still runs in
 * edit journeys, but the matching rule is the same: only selected problems
 * with missing owned fields are routed.
 *
 * When there is no eligible later problem, HOF falls back to `step.next`.
 */
const {
  ORDERED_PROBLEM_ORDER,
  getProblemOrder,
  toArray,
  hasFieldValue,
  getFieldsForProblemKey
} = require('./problem-utils');

// Current problem selection.
const getProblemSelection = req => toArray(req.sessionModel.get('problem'));

const problemHasMissingOwnedFields = (req, problemKey) => {
  const fields = getFieldsForProblemKey(req, problemKey);

  return fields.some(fieldName => !hasFieldValue(req.sessionModel.get(fieldName)));
};

// Find the next selected problem after the current step where owned fields
// are incomplete.
const nextSelectedProblem = (req, afterKey = null) => {
  const selected = new Set(getProblemSelection(req));
  const afterOrder = getProblemOrder(afterKey);

  for (const problem of ORDERED_PROBLEM_ORDER) {
    if (problem.order <= afterOrder) {
      continue;
    }

    if (!selected.has(problem.key)) {
      continue;
    }

    if (problemHasMissingOwnedFields(req, problem.key)) {
      return problem.target;
    }
  }

  return null;
};

// Only one fork should match: the next selected problem target.
const isNextProblemTarget = (req, target, afterKey = null) => nextSelectedProblem(req, afterKey) === target;

// Build HOF fork entries for problems that appear later in the configured order.
const buildProblemForks = (afterKey = null) => {
  const afterOrder = getProblemOrder(afterKey);
  return ORDERED_PROBLEM_ORDER.filter(problem => problem.order > afterOrder).map(problem => ({
    target: problem.target.startsWith('/') ? problem.target : `/${problem.target}`,
    continueOnEdit: true,
    condition: req => isNextProblemTarget(req, problem.target, afterKey)
  }));
};

module.exports = {
  buildProblemForks
};
