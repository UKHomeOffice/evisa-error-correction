export const ConstantsLib = {
  FULL_NAME: 'HOF TEST',
  GIVEN_NAMES: 'Hof',
  LAST_NAME: 'Test',
  DOB_1978: '01/01/1978',
  NATIONALITY: 'Spain',
  SAS_HOF_EMAIL: process.env.SAS_HOF_EMAIL || 'sas.hof@example.com',
  ADDRESS_LINE_1: '10 Downing Street',
  TOWN_OR_CITY: 'London',
  COUNTRY_UK: 'United Kingdom',
  POSTCODE: 'SW1A 2AA',
  REPRESENTATIVE_TYPE: 'Sponsor'
} as const;