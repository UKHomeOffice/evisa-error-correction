const { clearProblemSessionState } = require('../../utils/clear-problem-session-state');

jest.mock('notifications-node-client', () => ({
  NotifyClient: jest.fn().mockImplementation(() => ({
    sendEmail: jest.fn()
  }))
}));

const app = require('../../apps/eec');
const reqres = require('hof').utils.reqres;
const Model = require('hof').model;

describe('clear-problem-session-state helper', () => {
  let req;

  beforeEach(() => {
    req = reqres.req();
    req.form = {
      options: {
        steps: app.steps
      }
    };
  });

  test('clears canonical and internal-route problem fields', () => {
    req.sessionModel = new Model({
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

    clearProblemSessionState(req);

    expect(req.sessionModel.get('detail-share-code')).toBeUndefined();
    expect(req.sessionModel.get('how-many-adults')).toBeUndefined();
    expect(req.sessionModel.get('correct-passport-number-adult-1')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-before-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-current-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-values-before-edit')).toBeUndefined();
  });

  test('ignores missing or invalid route field definitions while clearing snapshot keys', () => {
    req.form = {
      options: {
        steps: {
          '/share-code': {
            fields: 'not-an-array'
          }
        }
      }
    };

    req.sessionModel = new Model({
      'detail-share-code': 'ABC123',
      'problem-selection-before-edit': ['problem-share-code'],
      'problem-selection-current-edit': ['problem-share-code'],
      'problem-values-before-edit': {
        'problem-share-code': {
          'detail-share-code': 'ABC123'
        }
      }
    });

    clearProblemSessionState(req);

    expect(req.sessionModel.get('detail-share-code')).toBe('ABC123');
    expect(req.sessionModel.get('problem-selection-before-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-current-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-values-before-edit')).toBeUndefined();
  });

  test('clears snapshot keys even when steps config is missing', () => {
    req.form = {};
    req.sessionModel = new Model({
      'detail-share-code': 'ABC123',
      'problem-selection-before-edit': ['problem-share-code'],
      'problem-selection-current-edit': ['problem-share-code'],
      'problem-values-before-edit': {
        'problem-share-code': {
          'detail-share-code': 'ABC123'
        }
      }
    });

    clearProblemSessionState(req);

    expect(req.sessionModel.get('detail-share-code')).toBe('ABC123');
    expect(req.sessionModel.get('problem-selection-before-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-selection-current-edit')).toBeUndefined();
    expect(req.sessionModel.get('problem-values-before-edit')).toBeUndefined();
  });
});
