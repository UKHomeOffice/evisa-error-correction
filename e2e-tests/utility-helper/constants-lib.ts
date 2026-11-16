export class ConstantsLib {
  static readonly YES = 'Yes';
  static readonly NO = 'No';
  static readonly FULL_NAME = 'HOF TEST';
  static readonly DOB_1978 = '01/01/1978';
  static readonly NATIONALITY = 'Spain';
  static readonly SAS_HOF_EMAIL = requiredEnv('SAS_HOF_EMAIL');
  static readonly TEXT_AREA_FIELD_DATA = 'HOF Test Data Test!! Checking the text area field';
  static readonly CORRECT_NAME = 'Hof Test';
  static readonly BRP_NUMBER = 'RZ1234567';
  static readonly GWF_NUMBER = 'GWF123456789';
  static readonly UAN_NUMBER = '1212-1234-1234-1234';
  static readonly PASSPORT_NUMBER = '120382978';
  static readonly UKVI_CUSTOMER_NUMBER = 'KX12345678';
  static readonly SPONSOR_LICENCE_NUMBER = 'ABCdeF12345';
  static readonly PHOTO_PROBLEM = 'Photo does not match my identity';
  static readonly SHARE_CODE = 'S1A2B3';
  static readonly SHIP_AND_PORT_DETAILS = 'MV Kent - Dover';
  static readonly SIGN_IN_EMAIL = 'sas.hof@example.com';
  static readonly SIGN_IN_PHONE = '07876075243';
  static readonly RESTRICTIONS_DETAILS = 'Can work only 20 hours during term time';
  static readonly UNLISTED_PROBLEM = 'My BRP details are missing from the account';
  static readonly VALID_FROM = '11/10/2020';
  static readonly VALID_TO = '11/10/2030';
  static readonly ONE_ACCOMPANYING_ADULT = '1|Alex Smith|P1234567';
  static readonly TWO_ACCOMPANYING_ADULTS = '2|P1234567|P7654321';
  static readonly CONTACT_ADDRESS_LINE_1 = '10 Downing Street';
  static readonly CONTACT_TOWN = 'London';
  static readonly CONTACT_COUNTY = 'United Kingdom';
  static readonly CONTACT_POSTCODE = 'SW1A 2AA';
}

function requiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`${name} is not configured`);
    }
    return value;
}