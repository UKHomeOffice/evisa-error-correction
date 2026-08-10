const { getLabel, formatDate, genNotifyErrorMsg, truncate, joinNonEmpty } = require('../../utils');

describe('Utilities \'getLabel\'', () => {
  test('replaces the correct label from value for \'requestor-reference-type\' field', () => {
    expect(getLabel('requestor-reference-type', 'brp')).toBe('BRP number');
    expect(getLabel('requestor-reference-type', 'gwf')).toBe('GWF number');
    expect(getLabel('requestor-reference-type', 'uan')).toBe('UAN number');
    expect(getLabel('requestor-reference-type', 'passport')).toBe('Passport number');
    expect(getLabel('requestor-reference-type', 'no-reference')).toBe('I do not have a reference number');
  });

  test('returns the correct string if the input value was an array', () => {
    expect(getLabel('requestor-reference-type', ['brp', 'gwf'])).toBe('BRP number, GWF number');
  });

  test('returns undefined when array input contains only unknown options', () => {
    expect(getLabel('requestor-reference-type', ['unknown-value'])).toBe(undefined);
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

  test('returns confirm summary field labels when labelType is confirm-field', () => {
    expect(getLabel('how-many-adults', undefined, 'confirm-field')).toBe('Number of adults accompanying a child');
    expect(getLabel('correct-given-names-adult-accompanying', undefined, 'confirm-field'))
      .toBe('Name and passport number of accompanying adult');
    expect(getLabel('correct-passport-number-adult-1', undefined, 'confirm-field'))
      .toBe('Passport numbers of accompanying adults');
  });

  test('returns undefined for unknown confirm summary field labels', () => {
    expect(getLabel('not-a-confirm-field', undefined, 'confirm-field')).toBe(undefined);
  });

  test('falls back to options lookup when labelType is omitted or empty', () => {
    expect(getLabel('requestor-reference-type', 'brp')).toBe('BRP number');
    expect(getLabel('requestor-reference-type', 'brp', '')).toBe('BRP number');
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

describe('Utilities \'genNotifyErrorMsg\'', () => {
  let error;

  beforeEach(() => {
    error = new Error('Template not found');
    error.response = {
      data: {
        prop: 'test data...'
      }
    };
    error.code = 'ERR_BAD_REQUEST';
  });

  test('parses an error with the expected Notify format into an expected message string', () => {
    expect(genNotifyErrorMsg(error)).toBe('ERR_BAD_REQUEST - Template not found; Cause: {"prop":"test data..."}');
  });

  test('parses an error into an expected message string when error.response.data is not present', () => {
    delete error.response;
    expect(genNotifyErrorMsg(error)).toBe('ERR_BAD_REQUEST - Template not found; ');
  });

  test('parses an error into an expected message string when error.code is not present', () => {
    delete error.code;
    expect(genNotifyErrorMsg(error)).toBe(' Template not found; Cause: {"prop":"test data..."}');
  });

  test('parses an error into an expected message string when error.code and error.response are not present', () => {
    delete error.code;
    delete error.response;
    expect(genNotifyErrorMsg(error)).toBe(' Template not found; ');
  });
});

describe('Utilities \'joinNonEmpty\'', () => {
  test('joins non-empty values with default separator', () => {
    expect(joinNonEmpty(['A', '', null, 'B', undefined, 'C'])).toBe('A B C');
  });

  test('joins non-empty values with a custom separator', () => {
    expect(joinNonEmpty(['A', '', 'B'], ', ')).toBe('A, B');
  });

  test('returns an empty string when all values are empty', () => {
    expect(joinNonEmpty(['', null, undefined, false, 0])).toBe('');
  });
});

describe('Utilities \'truncate\'', () => {
  test('returns original string when maxLen is greater than string length', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  test('truncates and appends ellipsis when string length is greater than or equal to maxLen', () => {
    expect(truncate('hello world', 5)).toBe('hello...');
    expect(truncate('hello', 5)).toBe('hello...');
  });

  test('trims trailing whitespace before appending ellipsis', () => {
    expect(truncate('hello   world', 8)).toBe('hello...');
  });

  test('handles undefined input with default parameters', () => {
    expect(truncate()).toBe('');
  });
});
