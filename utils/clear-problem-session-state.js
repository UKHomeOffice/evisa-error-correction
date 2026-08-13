const {
  PROBLEM_ORDER,
  getFieldsForProblemKey
} = require('./problem-utils');

// Build the unique set of problem-related fields that should be unset.
const getProblemFieldsToClear = req => {
  const fields = new Set();

  PROBLEM_ORDER.forEach(problem => {
    const routeFields = getFieldsForProblemKey(req, problem.key);
    routeFields.forEach(fieldName => fields.add(fieldName));
  });

  return fields;
};

// Clear problem fields and edit snapshot keys in one shared place.
const clearProblemSessionState = req => {
  getProblemFieldsToClear(req).forEach(fieldName => {
    req.sessionModel.unset(fieldName);
  });

  req.sessionModel.unset('problem-selection-before-edit');
  req.sessionModel.unset('problem-selection-current-edit');
  req.sessionModel.unset('problem-values-before-edit');
};

module.exports = {
  clearProblemSessionState
};
