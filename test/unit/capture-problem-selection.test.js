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

  test('saveValues snapshots using session values when req.form.values is missing', () => {
    req.form = {
      options: {
        route: '/share-code',
        steps: app.steps
      }
    };

    instance.saveValues(req, res, next);

    expect(req.sessionModel.get('problem-values-before-edit')).toEqual({
      'problem-share-code': {
        'detail-share-code': 'old share code'
      },
      'problem-other': {
        'problem-not-listed': 'old problem text'
      }
    });
  });

  test('edit problem-selection submit uses submitted selection for current edit and snapshot', () => {
    req.form.values = {
      problem: ['problem-share-code']
    };

    instance.saveValues(req, res, next);

    expect(req.sessionModel.get('problem-selection-current-edit')).toEqual(['problem-share-code']);
    expect(req.sessionModel.get('problem-values-before-edit')).toEqual({
      'problem-share-code': {
        'detail-share-code': 'old share code'
      }
    });
  });

  test('edit problem-selection submit supports empty submitted selection', () => {
    req.form.values = {
      problem: []
    };

    instance.saveValues(req, res, next);

    expect(req.sessionModel.get('problem-selection-current-edit')).toEqual([]);
    expect(req.sessionModel.get('problem-values-before-edit')).toEqual({});
  });

  test('problem submit clears internal accompanying-adult page fields while keeping parent selection metadata', () => {
    req.sessionModel.set('problem', ['problem-accompanying-adult-details', 'problem-share-code']);
    req.sessionModel.set('steps', [
      '/problem',
      '/how-many-adults',
      '/correct-details-adult-accompanying',
      '/correct-passport-number'
    ]);
    req.sessionModel.set('how-many-adults', '1-adult');
    req.sessionModel.set('correct-given-names-adult-accompanying', 'Adult Given');
    req.sessionModel.set('correct-last-name-adult-accompanying', 'Adult Last');
    req.sessionModel.set('correct-passport-number-adult-accompanying', 'P1234567');
    req.sessionModel.set('correct-passport-number-adult-1', 'A1-OLD');
    req.sessionModel.set('correct-passport-number-adult-2', 'A2-OLD');
    req.form.values = {
      problem: ['problem-share-code', 'problem-other']
    };

    instance.saveValues(req, res, next);

    expect(req.sessionModel.get('how-many-adults')).toBe('1-adult');
    expect(req.sessionModel.get('correct-given-names-adult-accompanying')).toBeUndefined();
    expect(req.sessionModel.get('correct-last-name-adult-accompanying')).toBeUndefined();
    expect(req.sessionModel.get('correct-passport-number-adult-accompanying')).toBeUndefined();
    expect(req.sessionModel.get('correct-passport-number-adult-1')).toBeUndefined();
    expect(req.sessionModel.get('correct-passport-number-adult-2')).toBeUndefined();
    expect(req.sessionModel.get('steps')).toEqual([
      '/problem',
      '/how-many-adults'
    ]);
    expect(req.sessionModel.get('problem-selection-current-edit')).toEqual([
      'problem-share-code',
      'problem-other'
    ]);
  });

  test('non-edit problem submit also clears internal accompanying-adult fields and routes when deselected', () => {
    req.params = {};
    req.sessionModel.set('problem', ['problem-accompanying-adult-details', 'problem-share-code']);
    req.sessionModel.set('steps', [
      '/problem',
      '/correct-details-adult-accompanying',
      '/correct-passport-number'
    ]);
    req.sessionModel.set('correct-given-names-adult-accompanying', 'Adult Given');
    req.sessionModel.set('correct-last-name-adult-accompanying', 'Adult Last');
    req.sessionModel.set('correct-passport-number-adult-accompanying', 'P1234567');
    req.sessionModel.set('correct-passport-number-adult-1', 'A1-OLD');
    req.sessionModel.set('correct-passport-number-adult-2', 'A2-OLD');
    req.form.values = {
      problem: ['problem-share-code']
    };

    instance.saveValues(req, res, next);

    expect(req.sessionModel.get('correct-given-names-adult-accompanying')).toBeUndefined();
    expect(req.sessionModel.get('correct-last-name-adult-accompanying')).toBeUndefined();
    expect(req.sessionModel.get('correct-passport-number-adult-accompanying')).toBeUndefined();
    expect(req.sessionModel.get('correct-passport-number-adult-1')).toBeUndefined();
    expect(req.sessionModel.get('correct-passport-number-adult-2')).toBeUndefined();
    expect(req.sessionModel.get('steps')).toEqual(['/problem']);
  });

  test('restores later selected problem values after edit invalidation', () => {
    instance.saveValues(req, res, next);
    req.sessionModel.set('problem-not-listed', '');

    instance.successHandler(req, res);

    expect(req.sessionModel.get('problem-not-listed')).toBe('old problem text');
    expect(res.redirect).toHaveBeenCalledWith('/next');
  });

  test('does not restore values for problems removed from current selection', () => {
    req.sessionModel.set('problem', ['problem-share-code']);
    req.sessionModel.set('problem-not-listed', '');
    req.sessionModel.set('problem-values-before-edit', {
      'problem-share-code': {
        'detail-share-code': 'old share code'
      },
      'problem-other': {
        'problem-not-listed': 'old problem text'
      }
    });

    instance.successHandler(req, res);

    expect(req.sessionModel.get('problem-not-listed')).toBe('');
    expect(res.redirect).toHaveBeenCalledWith('/next');
  });

  test('restores adults internal-fork progress steps for 1-adult selection in edit journey', () => {
    req.sessionModel.set('problem', ['problem-accompanying-adult-details']);
    req.sessionModel.set('how-many-adults', '1-adult');
    req.sessionModel.set('steps', ['/problem', '/your-evisa-details']);

    instance.successHandler(req, res);

    expect(req.sessionModel.get('steps')).toEqual([
      '/problem',
      '/your-evisa-details',
      '/how-many-adults',
      '/correct-details-adult-accompanying'
    ]);
  });

  test('restores adults internal-fork progress steps for 2-adults selection in edit journey', () => {
    req.sessionModel.set('problem', ['problem-accompanying-adult-details']);
    req.sessionModel.set('how-many-adults', '2-adults');
    req.sessionModel.set('steps', ['/problem', '/your-evisa-details']);

    instance.successHandler(req, res);

    expect(req.sessionModel.get('steps')).toEqual([
      '/problem',
      '/your-evisa-details',
      '/how-many-adults',
      '/correct-passport-number'
    ]);
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

  test('successHandler handles missing problem-values-before-edit snapshot', () => {
    req.sessionModel.unset('problem-values-before-edit');
    req.sessionModel.set('problem', ['problem-share-code', 'problem-other']);

    instance.successHandler(req, res);

    expect(req.sessionModel.get('problem-not-listed')).toBe('old problem text');
    expect(res.redirect).toHaveBeenCalledWith('/next');
  });

  test('successHandler ignores selected problem keys with undefined snapshot buckets', () => {
    req.sessionModel.set('problem', ['problem-share-code']);
    req.sessionModel.set('detail-share-code', '');
    req.sessionModel.set('problem-values-before-edit', {
      'problem-share-code': undefined
    });

    instance.successHandler(req, res);

    expect(req.sessionModel.get('detail-share-code')).toBe('');
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

  test('keeps existing snapshot keys on non-edit submit when problem field is not posted', () => {
    req.params = {};
    req.form.values = {
      'detail-share-code': 'changed outside problem selection'
    };
    req.sessionModel.set('problem-selection-before-edit', ['problem-share-code']);
    req.sessionModel.set('problem-selection-current-edit', ['problem-share-code']);
    req.sessionModel.set('problem-values-before-edit', {
      'problem-share-code': {
        'detail-share-code': 'old share code'
      }
    });

    instance.saveValues(req, res, next);

    expect(req.sessionModel.get('problem-selection-before-edit')).toEqual(['problem-share-code']);
    expect(req.sessionModel.get('problem-selection-current-edit')).toEqual(['problem-share-code']);
    expect(req.sessionModel.get('problem-values-before-edit')).toEqual({
      'problem-share-code': {
        'detail-share-code': 'old share code'
      }
    });
  });

  test('edit success ignores selected problems whose normalized route is null', () => {
    jest.isolateModules(() => {
      jest.doMock('../../utils/problem-utils', () => ({
        PROBLEM_ORDER: [
          { key: 'problem-invalid-target', target: null, order: 1 }
        ],
        toArray: value => {
          if (!value) {
            return [];
          }
          return Array.isArray(value) ? value : [value];
        },
        normaliseRoute: () => null,
        hasFieldValue: value => value !== undefined && value !== null && value !== '',
        getFieldsForProblemKey: () => [],
        getFieldsForRoutes: () => [],
        getInternalRoutesForProblemKey: () => [],
        isEditJourney: reqArg => Boolean(reqArg.params?.action === 'edit')
      }));

      const BehaviourWithMock = require('../../apps/eec/behaviours/capture-problem-selection');

      class BaseWithMock extends EventEmitter {
        saveValues() {}

        getNextStep() {
          return '/next';
        }
      }

      const reqWithMock = reqres.req();
      const resWithMock = reqres.res();
      resWithMock.redirect = jest.fn();

      reqWithMock.form = {
        values: { problem: ['problem-invalid-target'] },
        options: { steps: {} }
      };
      reqWithMock.params = { action: 'edit' };
      reqWithMock.sessionModel = new Model({
        problem: ['problem-invalid-target'],
        steps: ['/problem']
      });

      const MockedInstance = BehaviourWithMock(BaseWithMock);
      const mockedInstance = new MockedInstance();

      mockedInstance.successHandler(reqWithMock, resWithMock);

      expect(reqWithMock.sessionModel.get('steps')).toEqual(['/problem']);
      expect(resWithMock.redirect).toHaveBeenCalledWith('/next');
    });

    jest.resetModules();
    jest.unmock('../../utils/problem-utils');
  });
});
