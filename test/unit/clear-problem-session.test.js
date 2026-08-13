const EventEmitter = require('events');
const reqres = require('hof').utils.reqres;
const Model = require('hof').model;

jest.mock('../../utils/clear-problem-session-state', () => ({
  clearProblemSessionState: jest.fn()
}));

const Behaviour = require('../../apps/eec/behaviours/clear-problem-session');
const { clearProblemSessionState } = require('../../utils/clear-problem-session-state');

describe('clear-problem-session behaviour', () => {
  class Base extends EventEmitter {
    locals() {
      return 'base-locals-result';
    }
  }

  let req;
  let res;
  let Instance;
  let instance;

  beforeEach(() => {
    clearProblemSessionState.mockReset();
    req = reqres.req();
    res = reqres.res();

    Base.prototype.locals = jest.fn(() => 'base-locals-result');
    Instance = Behaviour(Base);
    instance = new Instance();
  });

  test('delegates clearing to helper when no problems are selected', () => {
    req.sessionModel = new Model({
      problem: []
    });

    const result = instance.locals(req, res);

    expect(clearProblemSessionState).toHaveBeenCalledTimes(1);
    expect(clearProblemSessionState).toHaveBeenCalledWith(req);
    expect(result).toBe('base-locals-result');
  });

  test('does not call helper when at least one problem remains selected', () => {
    req.sessionModel = new Model({
      problem: ['problem-share-code']
    });

    const result = instance.locals(req, res);

    expect(clearProblemSessionState).not.toHaveBeenCalled();
    expect(result).toBe('base-locals-result');
  });
});
