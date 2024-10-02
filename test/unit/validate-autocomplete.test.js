const Controller = require('hof').controller;
const Behaviour = require('../../apps/eec/behaviours/validate-autocomplete');
const reqres = require('hof').utils.reqres;

describe('validate-autocomplete behaviour', () => {
  test('Behaviour exports a function', () => {
    expect(typeof Behaviour).toBe('function');
  });

  let req;
  let res;
  let instance;
  let validateAutocomplete;

  beforeEach(() => {
    req = reqres.req();
    res = reqres.res();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('The \'validate\' method', () => {
    beforeEach(() => {
      validateAutocomplete = Behaviour('test-field')(Controller);
      instance = new validateAutocomplete({ template: 'index', route: '/index' });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should throw a ValidationError if autocomplete fields contain invalid data', () => {
      req.body = { 'test-field-auto': 'bad-value' };
      instance.validate(req, res, error => {
        expect(error['test-field']).toBeInstanceOf(instance.ValidationError);
        expect(error['test-field'].type).toBe('invalidOption');
      });
    });

    test('should throw a ValidationError if autocomplete fields contain empty string data', () => {
      req.body = { 'test-field-auto': '' };
      instance.validate(req, res, error => {
        expect(error['test-field']).toBeInstanceOf(instance.ValidationError);
        expect(error['test-field'].type).toBe('required');
      });
    });

    test('should not throw an error if autocomplete fields contain valid data', () => {
      req.body = { 'test-field-auto': 'France' };
      instance.validate(req, res, error => {
        expect(error).toBeUndefined();
      });
    });

    test('should have returned early if the autocomplete input was not found in req.body', () => {
      req.body = {};
      instance.validate(req, res, error => {
        expect(error).toBeUndefined();
      });
    });

    test('should have returned early if no field was given to the behaviour in index.js', () => {
      validateAutocomplete = Behaviour()(Controller);
      instance = new validateAutocomplete({ template: 'index', route: '/index' });
      req.body = { 'test-field-auto': 'bad-value' };
      instance.validate(req, res, error => {
        expect(error).toBeUndefined();
      });
    });
  });
});
