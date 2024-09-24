const { getLabel, formatDate, genErrorMsg } = require('../../utils');

describe('Utilities \'getLabel\'', () => {
  test('replaces the correct label from value for \'requestor-reference-type\' field', () => {
    expect(getLabel('requestor-reference-type', 'brp')).toBe('BRP number');
    expect(getLabel('requestor-reference-type', 'gwf')).toBe('GWF number');
    expect(getLabel('requestor-reference-type', 'uan')).toBe('UAN number');
    expect(getLabel('requestor-reference-type', 'passport')).toBe('Passport number');
    expect(getLabel('requestor-reference-type', 'no-reference')).toBe('I do not have a reference number');
  });

  test('returns undefined when an unexpected fieldKey parameter is passed', () => {
    expect(getLabel('cheese', 'brp')).toBe(undefined);
    expect(getLabel(null, 'brp')).toBe(undefined);
    expect(getLabel(undefined, 'brp')).toBe(undefined);
  });

  test('returns undefined when an unexpected fieldValue parameter is passed', () => {
    expect(getLabel('requestor-reference-type', 'Legoland-drivers-license')).toBe(undefined);
    expect(getLabel('requestor-reference-type', null)).toBe(undefined);
    expect(getLabel('requestor-reference-type', undefined)).toBe(undefined);
  });
});

describe('Utilities \'formatDate\'', () => {
  test('reformats a string type date from YYYY-MM-DD to DD/MM/YYYY', () => {
    expect(formatDate('1987-08-14')).toBe('14/08/1987');
  });

  test('reformats a string type date from MM/DD/YYYY to DD/MM/YYYY', () => {
    expect(formatDate('08/14/1987')).toBe('14/08/1987');
  });

  test('throws an error when the parameter cannot be parsed as a date', () => {
    expect(() => formatDate('hello')).toThrow();
  });
});

describe('Utilities \'genErrorMsg\'', () => {
  let error;

  beforeEach(() => {
    error = new Error('Template not found');
    error.response = {
      data: {
        prop: 'test data...'
      }
    };
    error.code = 404;
  });

  test('parses an error with the expected Notify format into an expected message string', () => {
    expect(genErrorMsg(error)).toBe('404 - Template not found; Cause: {"prop":"test data..."}');
  });

  test('parses an error into an expected message string when error.response.data is not present', () => {
    delete error.response;
    expect(genErrorMsg(error)).toBe('404 - Template not found; ');
  });

  test('parses an error into an expected message string when error.code is not present', () => {
    delete error.code;
    expect(genErrorMsg(error)).toBe(' Template not found; Cause: {"prop":"test data..."}');
  });

  test('parses an error into an expected message string when error.code and error.response are not present', () => {
    delete error.code;
    delete error.response;
    expect(genErrorMsg(error)).toBe(' Template not found; ');
  });
});
