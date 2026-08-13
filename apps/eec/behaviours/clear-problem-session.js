/*
 * Behaviour wrapper that clears problem session state when no problems are
 * selected. The actual clear logic lives in
 * utils/clear-problem-session-state.js and is shared with other behaviours.
 */
const {
  toArray
} = require('../../../utils/problem-utils');
const { clearProblemSessionState } = require('../../../utils/clear-problem-session-state');

const shouldClearProblemState = req => toArray(req.sessionModel.get('problem')).length === 0;

const behaviour = superclass => class extends superclass {
  locals(req, res) {
    if (shouldClearProblemState(req)) {
      clearProblemSessionState(req);
    }

    return super.locals(req, res);
  }
};

module.exports = behaviour;
