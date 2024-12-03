const Behaviour = require('../../apps/eec/behaviours/custom-redirect');
const reqres = require('hof').utils.reqres;
const Controller = require('hof').controller;

describe('custom-redirect behaviour', () => {
  test('Behaviour exports a function', () => {
    expect(typeof Behaviour).toBe('function');
  });

  let req;
  let res;
  let instance;
  let next;

  beforeEach(() => {
    req = reqres.req();
    res = reqres.res();
    res.redirect = jest.fn();
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('The \'successHandler\' method', () => {
    beforeEach(() => {
      const CustomRedirect = Behaviour(Controller);
      instance = new CustomRedirect({ template: 'index', route: '/refugee' });
    });

    test('should redirect to /asylum-support/edit if currentRoute is /refugee, action is edit, and is-refugee is yes', () => {
      req.form.options.route = '/refugee';
      req.params.action = 'edit';
      req.sessionModel.get = jest.fn().mockReturnValue('yes');

      instance.successHandler(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith('/asylum-support/edit');
    });

    test('should call super.successHandler if conditions are not met', () => {
      req.form.options.route = '/refugee';
      req.params.action = 'view';
      req.sessionModel.get = jest.fn().mockReturnValue('no');

      const superSuccessHandler = jest.spyOn(Controller.prototype, 'successHandler');

      instance.successHandler(req, res, next);

      expect(superSuccessHandler).toHaveBeenCalledWith(req, res, next);
    });
  });
});
