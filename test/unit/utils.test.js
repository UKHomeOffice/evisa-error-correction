const { getLabel } = require('../../utils');

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
