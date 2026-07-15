/*
 * Build the next problem fork for the current point in the journey.
 *
 * The fork list is ordered from the canonical problem order, but only the
 * first eligible later problem should match. Eligibility depends on two
 * session selections:
 * - the current selected problems in `problem`
 * - the pre-edit selection in `problem-selection-before-edit`
 *
 * Non-edit journeys move to the next selected problem in order.
 * Edit journeys first prefer a selected problem whose owned fields are now
 * missing, so the user is sent back to the incomplete step. If no selected
 * problem is incomplete, previously selected problems are skipped and the
 * next newly selected problem is used instead.
 *
 * When there is no eligible later problem, HOF falls back to `step.next`.
 */
const {
  ORDERED_PROBLEM_ORDER,
  getProblemOrder,
  toArray,
  getFieldsForProblemKey
} = require('./problem-utils');

// Current problem selection.
const getProblemSelection = req => toArray(req.sessionModel.get('problem'));

// Selection before entering edit mode.
const getPreEditProblemSelection = req => toArray(req.sessionModel.get('problem-selection-before-edit'));

// Whether the current request is an edit journey.
const isProblemEditJourney = req => {
  const params = req.params || {};
  return Boolean(params.edit || params.action === 'edit');
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

const problemHasMissingOwnedFields = (req, problemKey) => {
  const fields = getFieldsForProblemKey(req, problemKey);

  return fields.some(fieldName => !hasFieldValue(req.sessionModel.get(fieldName)));
};

// Find the next selected problem after the current step, preferring incomplete
// edit-step targets before newly selected later problems.
const nextSelectedProblem = (req, afterKey = null) => {
  const selected = new Set(getProblemSelection(req));
  const editJourney = isProblemEditJourney(req);
  const preEditSelected = new Set(getPreEditProblemSelection(req));
  const afterOrder = getProblemOrder(afterKey);

  if (editJourney && afterKey !== null && preEditSelected.size === 0) {
    return null;
  }

  for (const problem of ORDERED_PROBLEM_ORDER) {
    if (problem.order <= afterOrder) {
      continue;
    }

    if (!selected.has(problem.key)) {
      continue;
    }

    if (editJourney) {
      if (problemHasMissingOwnedFields(req, problem.key)) {
        return problem.target;
      }

      if (preEditSelected.has(problem.key)) {
        continue;
      }
    }

    return problem.target;
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
    condition: req => isNextProblemTarget(req, problem.target, afterKey)
  }));
};

module.exports = {
  buildProblemForks
};
