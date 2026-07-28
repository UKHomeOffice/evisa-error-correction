const EventEmitter = require('events');
const Behaviour = require('../../apps/eec/behaviours/capture-problem-selection');

jest.mock('notifications-node-client', () => ({
  NotifyClient: jest.fn().mockImplementation(() => ({
    sendEmail: jest.fn()
  }))
}));

const app = require('../../apps/eec');
const reqres = require('hof').utils.reqres;
const Model = require('hof').model;

describe('capture-problem-selection behaviour', () => {
  class Base extends EventEmitter {
    saveValues() {}

    getNextStep() {
      return '/next';
    }
  }

  let req;
  let res;
  let next;
  let Instance;
  let instance;

  beforeEach(() => {
    req = reqres.req();
    res = reqres.res();
    res.redirect = jest.fn();
    next = jest.fn();

    req.form = {
      values: {
        'detail-share-code': 'updated share code'
      },
      options: {
        route: '/share-code',
        steps: app.steps
      }
    };

    req.params = { action: 'edit' };
    req.sessionModel = new Model({
      problem: ['problem-share-code', 'problem-other'],
      'detail-share-code': 'old share code',
      'problem-not-listed': 'old problem text'
    });

    Base.prototype.saveValues = jest.fn();
    Instance = Behaviour(Base);
    instance = new Instance();
  });

  test('snapshots later selected problem values for any edit submit', () => {
    instance.saveValues(req, res, next);

    expect(req.sessionModel.get('problem-values-before-edit')).toEqual({
      'problem-share-code': {
        'detail-share-code': 'updated share code'
      },
      'problem-other': {
        'problem-not-listed': 'old problem text'
      }
    });
  });

  test('restores later selected problem values after edit invalidation', () => {
    instance.saveValues(req, res, next);
    req.sessionModel.set('problem-not-listed', '');

    instance.successHandler(req, res);

    expect(req.sessionModel.get('problem-not-listed')).toBe('old problem text');
    expect(res.redirect).toHaveBeenCalledWith('/next');
  });

  test('updates snapshot to latest values after successful edit submit', () => {
    instance.saveValues(req, res, next);
    req.sessionModel.set('detail-share-code', 'new share code');

    instance.successHandler(req, res);

    expect(req.sessionModel.get('problem-values-before-edit')).toEqual({
      'problem-share-code': {
        'detail-share-code': 'new share code'
      },
      'problem-other': {
        'problem-not-listed': 'old problem text'
      }
    });
  });

  test('does not restore values when URL params are not edit', () => {
    req.params = {};
    req.sessionModel.set('problem-values-before-edit', {
      'problem-share-code': {
        'detail-share-code': 'old share code'
      },
      'problem-other': {
        'problem-not-listed': 'old problem text'
      }
    });
    req.sessionModel.set('problem', ['problem-share-code', 'problem-other']);
    req.sessionModel.set('problem-not-listed', '');

    instance.successHandler(req, res);

    expect(req.sessionModel.get('problem-not-listed')).toBe('');
    expect(res.redirect).toHaveBeenCalledWith('/next');
  });

  test('clears problem state when previous selection is empty', () => {
    req.sessionModel.set('problem', []);
    req.sessionModel.set('problem-not-listed', 'stale value');
    req.sessionModel.set('problem-selection-before-edit', ['problem-other']);
    req.sessionModel.set('problem-selection-current-edit', ['problem-other']);
    req.sessionModel.set('problem-values-before-edit', {
      'problem-other': {
        'problem-not-listed': 'stale value'
      }
    });

    instance.saveValues(req, res, next);

    expect(req.sessionModel.get('problem-not-listed')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-before-edit')).toEqual([]);
    expect(req.sessionModel.get('problem-selection-current-edit')).toEqual([]);
    expect(req.sessionModel.get('problem-values-before-edit')).toEqual({});
  });

  test('clears edit snapshots on non-edit problem-selection submit', () => {
    req.params = {};
    req.form.values = {
      problem: ['problem-share-code']
    };
    req.sessionModel.set('problem-selection-before-edit', ['problem-share-code']);
    req.sessionModel.set('problem-selection-current-edit', ['problem-share-code']);
    req.sessionModel.unset('problem-values-before-edit');

    instance.saveValues(req, res, next);

    expect(req.sessionModel.get('problem-selection-before-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-current-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-values-before-edit')).toBeUndefined();
  });
});
