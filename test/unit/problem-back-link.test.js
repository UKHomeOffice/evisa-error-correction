const EventEmitter = require('events');
const Behaviour = require('../../apps/eec/behaviours/problem-back-link');
const reqres = require('hof').utils.reqres;
const Model = require('hof').model;

describe('problem-back-link behaviour', () => {
  class Base extends EventEmitter {
    getBackLink(req, res) {
      return res.locals.backLink || '/default-back-link';
    }
  }

  let req;
  let res;
  let Instance;
  let instance;

  beforeEach(() => {
    req = reqres.req();
    res = reqres.res();
    res.locals = {};

    req.form = {
      options: {
        route: '/your-evisa-details'
      }
    };

    req.sessionModel = new Model({
      problem: []
    });

    Instance = Behaviour(Base);
    instance = new Instance();
  });

  test('sets back-link from /your-evisa-details to last selected problem in canonical order', () => {
    req.sessionModel.set('problem', ['problem-full-name', 'problem-share-code']);

    const backLink = instance.getBackLink(req, res);

    expect(res.locals.backLink).toBe('share-code');
    expect(backLink).toBe('share-code');
  });

  test('sets back-link on a problem step to previous selected problem in canonical order', () => {
    req.form.options.route = '/correct-nationality';
    req.sessionModel.set('problem', ['problem-full-name', 'problem-nationality']);

    const backLink = instance.getBackLink(req, res);

    expect(res.locals.backLink).toBe('your-correct-name');
    expect(backLink).toBe('your-correct-name');
  });

  test('falls back to problem selection when no previous selected problem exists', () => {
    req.form.options.route = '/your-correct-name';
    req.sessionModel.set('problem', ['problem-full-name']);

    const backLink = instance.getBackLink(req, res);

    expect(res.locals.backLink).toBe('problem');
    expect(backLink).toBe('problem');
  });

  test('does not apply custom problem back-link logic outside problem routes', () => {
    req.form.options.route = '/contact';
    req.sessionModel.set('problem', ['problem-full-name', 'problem-share-code']);

    const backLink = instance.getBackLink(req, res);

    expect(res.locals.backLink).toBeUndefined();
    expect(backLink).toBe('/default-back-link');
  });

  test('normalises route fragments without a leading slash', () => {
    req.form.options.route = 'correct-nationality';
    req.sessionModel.set('problem', ['problem-full-name', 'problem-nationality']);

    const backLink = instance.getBackLink(req, res);

    expect(res.locals.backLink).toBe('your-correct-name');
    expect(backLink).toBe('your-correct-name');
  });
});
