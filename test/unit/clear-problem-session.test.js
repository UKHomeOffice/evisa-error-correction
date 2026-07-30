const EventEmitter = require('events');
const Behaviour = require('../../apps/eec/behaviours/clear-problem-session');

jest.mock('notifications-node-client', () => ({
  NotifyClient: jest.fn().mockImplementation(() => ({
    sendEmail: jest.fn()
  }))
}));

const app = require('../../apps/eec');
const reqres = require('hof').utils.reqres;
const Model = require('hof').model;

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
    req = reqres.req();
    res = reqres.res();

    req.form = {
      options: {
        steps: app.steps
      }
    };

    Base.prototype.locals = jest.fn(() => 'base-locals-result');
    Instance = Behaviour(Base);
    instance = new Instance();
  });

  test('clears problem fields and edit snapshot keys when no problems are selected', () => {
    req.sessionModel = new Model({
      problem: [],
      'detail-share-code': 'ABC123',
      'how-many-adults': '2-adults',
      'correct-passport-number-adult-1': 'P123',
      'problem-selection-before-edit': ['problem-share-code'],
      'problem-selection-current-edit': ['problem-share-code'],
      'problem-values-before-edit': {
        'problem-share-code': {
          'detail-share-code': 'ABC123'
        }
      }
    });

    const result = instance.locals(req, res);

    expect(req.sessionModel.get('detail-share-code')).toBeUndefined();
    expect(req.sessionModel.get('how-many-adults')).toBeUndefined();
    expect(req.sessionModel.get('correct-passport-number-adult-1')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-before-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-current-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-values-before-edit')).toBeUndefined();
    expect(result).toBe('base-locals-result');
  });

  test('does not clear problem state when at least one problem remains selected', () => {
    req.sessionModel = new Model({
      problem: ['problem-share-code'],
      'detail-share-code': 'ABC123',
      'problem-selection-before-edit': ['problem-share-code'],
      'problem-selection-current-edit': ['problem-share-code'],
      'problem-values-before-edit': {
        'problem-share-code': {
          'detail-share-code': 'ABC123'
        }
      }
    });

    const result = instance.locals(req, res);

    expect(req.sessionModel.get('detail-share-code')).toBe('ABC123');
    expect(req.sessionModel.get('problem-selection-before-edit')).toEqual(['problem-share-code']);
    expect(req.sessionModel.get('problem-selection-current-edit')).toEqual(['problem-share-code']);
    expect(req.sessionModel.get('problem-values-before-edit')).toEqual({
      'problem-share-code': {
        'detail-share-code': 'ABC123'
      }
    });
    expect(result).toBe('base-locals-result');
  });

  test('handles missing canonical problem routes in steps when clearing', () => {
    req.form = {
      options: {
        steps: {}
      }
    };
    req.sessionModel = new Model({
      problem: [],
      'problem-selection-before-edit': ['problem-share-code'],
      'problem-selection-current-edit': ['problem-share-code'],
      'problem-values-before-edit': {
        'problem-share-code': {
          'detail-share-code': 'ABC123'
        }
      }
    });

    const result = instance.locals(req, res);

    expect(req.sessionModel.get('problem-selection-before-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-current-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-values-before-edit')).toBeUndefined();
    expect(result).toBe('base-locals-result');
  });

  test('ignores fork targets that are missing from steps when clearing', () => {
    req.form = {
      options: {
        steps: {
          '/how-many-adults': {
            fields: ['how-many-adults'],
            forks: [
              {
                target: '/missing-fork-route'
              }
            ]
          }
        }
      }
    };
    req.sessionModel = new Model({
      problem: [],
      'how-many-adults': '2-adults',
      'problem-selection-before-edit': ['problem-accompanying-adult-details'],
      'problem-selection-current-edit': ['problem-accompanying-adult-details'],
      'problem-values-before-edit': {
        'problem-accompanying-adult-details': {
          'how-many-adults': '2-adults'
        }
      }
    });

    const result = instance.locals(req, res);

    expect(req.sessionModel.get('how-many-adults')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-before-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-current-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-values-before-edit')).toBeUndefined();
    expect(result).toBe('base-locals-result');
  });

  test('handles canonical route forks when forks config is not an array', () => {
    req.form = {
      options: {
        steps: {
          '/share-code': {
            fields: ['detail-share-code'],
            forks: {
              target: '/some-fork'
            }
          }
        }
      }
    };
    req.sessionModel = new Model({
      problem: [],
      'detail-share-code': 'ABC123',
      'problem-selection-before-edit': ['problem-share-code'],
      'problem-selection-current-edit': ['problem-share-code'],
      'problem-values-before-edit': {
        'problem-share-code': {
          'detail-share-code': 'ABC123'
        }
      }
    });

    const result = instance.locals(req, res);

    expect(req.sessionModel.get('detail-share-code')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-before-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-current-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-values-before-edit')).toBeUndefined();
    expect(result).toBe('base-locals-result');
  });

  test('handles fork targets whose fields config is not an array', () => {
    req.form = {
      options: {
        steps: {
          '/share-code': {
            fields: ['detail-share-code'],
            forks: [
              {
                target: '/fork-with-invalid-fields'
              }
            ]
          },
          '/fork-with-invalid-fields': {
            fields: 'not-an-array'
          }
        }
      }
    };
    req.sessionModel = new Model({
      problem: [],
      'detail-share-code': 'ABC123',
      'fork-only-field': 'keep-me',
      'problem-selection-before-edit': ['problem-share-code'],
      'problem-selection-current-edit': ['problem-share-code'],
      'problem-values-before-edit': {
        'problem-share-code': {
          'detail-share-code': 'ABC123'
        }
      }
    });

    const result = instance.locals(req, res);

    expect(req.sessionModel.get('detail-share-code')).toBeUndefined();
    expect(req.sessionModel.get('fork-only-field')).toBe('keep-me');
    expect(req.sessionModel.get('problem-selection-before-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-current-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-values-before-edit')).toBeUndefined();
    expect(result).toBe('base-locals-result');
  });

  test('clears snapshot keys even when steps config is missing', () => {
    req.form = {};
    req.sessionModel = new Model({
      problem: [],
      'detail-share-code': 'ABC123',
      'problem-selection-before-edit': ['problem-share-code'],
      'problem-selection-current-edit': ['problem-share-code'],
      'problem-values-before-edit': {
        'problem-share-code': {
          'detail-share-code': 'ABC123'
        }
      }
    });

    const result = instance.locals(req, res);

    expect(req.sessionModel.get('detail-share-code')).toBe('ABC123');
    expect(req.sessionModel.get('problem-selection-before-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-current-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-values-before-edit')).toBeUndefined();
    expect(result).toBe('base-locals-result');
  });
});
