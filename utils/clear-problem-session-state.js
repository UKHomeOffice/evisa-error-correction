const {
  PROBLEM_ORDER,
  getFieldsForProblemKey,
  clearFields
} = require('./problem-utils');

const EDIT_SNAPSHOT_FIELDS = [
  'problem-selection-before-edit',
  'problem-selection-current-edit',
  'problem-values-before-edit'
];

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
  clearFields(req, [
    ...getProblemFieldsToClear(req),
    ...EDIT_SNAPSHOT_FIELDS
  ]);
};

module.exports = {
  clearProblemSessionState
};
