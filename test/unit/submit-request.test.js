const Behaviour = require('../../apps/eec/behaviours/submit-request');
const reqres = require('hof').utils.reqres;
const Model = require('hof').model;

jest.mock('../../config.js', () => {
  const originalModule = jest.requireActual('../../config.js');
  return {
    ...originalModule,
    govukNotify: {
      notifyApiKey: 'test',
      caseworkerEmail: 'test@example.com',
      userConfirmationTemplateId: '123-456',
      businessConfirmationTemplateId: '456-789',
      replyToId: '789-123'
    }
  };
});

const NotifyClient = require('notifications-node-client').NotifyClient;

describe('submit-feedback behaviour', () => {
  test('Behaviour exports a function', () => {
    expect(typeof Behaviour).toBe('function');
  });

  class Base {
    saveValues() {}
  }

  let req;
  let res;
  let instance;
  let next;
  let emailProps;
  let SubmitRequest;

  beforeEach(() => {
    req = reqres.req();
    res = reqres.res();
    next = jest.fn();

    SubmitRequest = Behaviour(Base);
    instance = new SubmitRequest();
  });

  describe('The \'saveValues\' method', () => {
    beforeEach(() => {
      Base.prototype.saveValues = jest.fn().mockReturnValue(req, res, next);
      NotifyClient.prototype.sendEmail = jest.fn().mockResolvedValue({data: {}});

      req.form = {
        options: {
          steps: {
            '/photo': {
              fields: ['photo']
            },
            '/national-insurance-number': {
              fields: ['correct-national-insurance-number']
            },
            '/your-correct-name': {
              fields: ['correct-given-names', 'correct-last-name']
            },
            '/correct-date-of-birth': {
              fields: ['correct-date-of-birth']
            }
          }
        }
      };

      req.sessionModel = new Model({
        problem: ['problem-photo', 'problem-national-insurance-number'],
        premium: ['premium-super-priority'],
        'trying-to-do': ['trying-to-report-error'],
        'in-uk': 'no',
        'booked-travel': 'yes',
        'booked-travel-date-to-uk': '2025-06-24',
        'travel-doc-number': '120383978A',
        'travel-doc-nationality': 'France',
        'travel-doc-dob': '1987-08-14',
        'accessing-evisa': 'yes',
        'asylum-support': 'no',
        photo: 'photo bad',
        'correct-national-insurance-number': 'QQ123456A',
        'requestor-full-name': 'test user',
        'requestor-dob': '1987-08-14',
        'describe-evisa-error': 'There is an error with my evisa',
        'requestor-nationality': 'France',
        'formatted-reference': 'I do not have a reference',
        'is-refugee': 'yes',
        'requestor-contact-method': 'email',
        'requestor-email': 'test@example.com',
        'formatted-address': 'fake address',
        'completing-for-someone-else': 'no'
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('saveValues should be called', async () => {
      await instance.saveValues(req, res, next);
      expect(Base.prototype.saveValues).toHaveBeenCalled();
    });

    test('Notify sendEmail should be called once when \'requestor-email\' is set ', async () => {
      await instance.saveValues(req, res, next);
      expect(NotifyClient.prototype.sendEmail).toHaveBeenCalledTimes(1);
    });

    test('Notify sendEmail should be called once when \'requestor-email\' is not set ', async () => {
      req.sessionModel.set('requestor-email', undefined);
      await instance.saveValues(req, res, next);
      expect(NotifyClient.prototype.sendEmail).toHaveBeenCalledTimes(1);
    });

    test('Notify sendEmail to business is called with the correct props if has access to eVisa', async () => {
      req.sessionModel.unset('describe-evisa-error');

      emailProps = {
        personalisation: {
          in_uk: 'No',
          is_not_in_uk: 'yes',
          booked_travel: 'Yes, I have booked my travel',
          is_booked_travel: 'yes',
          booked_travel_date_to_uk: '24/06/2025',
          travel_doc_number: '120383978A',
          travel_doc_nationality: 'France',
          travel_doc_dob: '14/08/1987',
          premium: 'I paid for a super priority service',
          accessing_evisa: 'Yes, I can see an eVisa in my UKVI account',
          accessing_evisa_possible: 'yes',
          trying_to_do: 'Report an error with your eVisa',
          asylum_support: 'No',
          full_name: 'test user',
          date_of_birth: '14/08/1987',
          evisa_error_description_provided: 'no',
          describe_evisa_error: '',
          nationality: 'France',
          reference: 'I do not have a reference',
          is_refugee: 'Yes',
          corrected_evisa_details: 'yes',
          problem_notes: 'Photo: photo bad\n\nNational Insurance number: QQ123456A\n\n',
          contact_email: 'test@example.com',
          contact_address: 'none provided',
          completing_for_someone_else: 'No',
          representative_name: '',
          representative_email: '',
          representative_type: ''
        },
        emailReplyToId: '789-123'
      };
      await instance.saveValues(req, res, next);
      expect(NotifyClient.prototype.sendEmail)
        .toHaveBeenCalledWith('456-789', 'test@example.com', emailProps);
    });

    test('Notify sendEmail to business is called with the correct props if has no access to eVisa', async () => {
      req.sessionModel.set('accessing-evisa', 'no');
      req.sessionModel.unset('trying-to-do');
      req.sessionModel.unset('problem');

      emailProps = {
        personalisation: {
          in_uk: 'No',
          is_not_in_uk: 'yes',
          booked_travel: 'Yes, I have booked my travel',
          is_booked_travel: 'yes',
          booked_travel_date_to_uk: '24/06/2025',
          travel_doc_number: '120383978A',
          travel_doc_nationality: 'France',
          travel_doc_dob: '14/08/1987',
          premium: 'I paid for a super priority service',
          accessing_evisa: 'No, I cannot access my eVisa or UKVI account',
          accessing_evisa_possible: 'no',
          trying_to_do: '',
          asylum_support: 'No',
          full_name: 'test user',
          date_of_birth: '14/08/1987',
          evisa_error_description_provided: 'yes',
          describe_evisa_error: 'There is an error with my evisa',
          nationality: 'France',
          reference: 'I do not have a reference',
          is_refugee: 'Yes',
          corrected_evisa_details: 'no',
          problem_notes: '',
          contact_email: 'test@example.com',
          contact_address: 'none provided',
          completing_for_someone_else: 'No',
          representative_name: '',
          representative_email: '',
          representative_type: ''
        },
        emailReplyToId: '789-123'
      };
      await instance.saveValues(req, res, next);
      expect(NotifyClient.prototype.sendEmail)
        .toHaveBeenCalledWith('456-789', 'test@example.com', emailProps);
    });

    test('Business sendEmail is called with the correct props if only one problem had been added'
      + ' and has no access to eVisa', async () => {
      req.sessionModel.set('accessing-evisa', 'no');
      req.sessionModel.set('problem', 'problem-full-name');
      req.sessionModel.set('correct-given-names', 'Corrected given');
      req.sessionModel.set('correct-last-name', 'name');
      req.sessionModel.set('asylum-support', 'Yes');
      req.sessionModel.unset('photo');
      req.sessionModel.unset('correct-national-insurance-number');
      req.sessionModel.unset('trying-to-do');
      req.sessionModel.unset('describe-evisa-error');

      emailProps = {
        personalisation: {
          in_uk: 'No',
          is_not_in_uk: 'yes',
          booked_travel: 'Yes, I have booked my travel',
          is_booked_travel: 'yes',
          booked_travel_date_to_uk: '24/06/2025',
          travel_doc_number: '120383978A',
          travel_doc_nationality: 'France',
          travel_doc_dob: '14/08/1987',
          premium: 'I paid for a super priority service',
          accessing_evisa: 'No, I cannot access my eVisa or UKVI account',
          accessing_evisa_possible: 'no',
          trying_to_do: '',
          full_name: 'test user',
          date_of_birth: '14/08/1987',
          evisa_error_description_provided: 'no',
          describe_evisa_error: '',
          nationality: 'France',
          reference: 'I do not have a reference',
          is_refugee: 'Yes',
          corrected_evisa_details: 'yes',
          problem_notes: 'Name: Corrected given name\n\n',
          contact_email: 'test@example.com',
          contact_address: 'none provided',
          completing_for_someone_else: 'No',
          representative_name: '',
          representative_email: '',
          representative_type: ''
        },
        emailReplyToId: '789-123'
      };
      await instance.saveValues(req, res, next);
      expect(NotifyClient.prototype.sendEmail)
        .toHaveBeenCalledWith('456-789', 'test@example.com', emailProps);
    });

    test('Business sendEmail is called with the correct props if contact method is address', async () => {
      req.sessionModel.set('requestor-contact-method', 'uk-address');

      emailProps = {
        personalisation: {
          in_uk: 'No',
          is_not_in_uk: 'yes',
          booked_travel: 'Yes, I have booked my travel',
          is_booked_travel: 'yes',
          booked_travel_date_to_uk: '24/06/2025',
          travel_doc_number: '120383978A',
          travel_doc_nationality: 'France',
          travel_doc_dob: '14/08/1987',
          premium: 'I paid for a super priority service',
          accessing_evisa: 'Yes, I can see an eVisa in my UKVI account',
          accessing_evisa_possible: 'yes',
          trying_to_do: 'Report an error with your eVisa',
          asylum_support: 'No',
          full_name: 'test user',
          date_of_birth: '14/08/1987',
          evisa_error_description_provided: 'yes',
          describe_evisa_error: 'There is an error with my evisa',
          nationality: 'France',
          reference: 'I do not have a reference',
          is_refugee: 'Yes',
          corrected_evisa_details: 'yes',
          problem_notes: 'Photo: photo bad\n\nNational Insurance number: QQ123456A\n\n',
          contact_email: 'none provided',
          contact_address: 'fake address',
          completing_for_someone_else: 'No',
          representative_name: '',
          representative_email: '',
          representative_type: ''
        },
        emailReplyToId: '789-123'
      };

      await instance.saveValues(req, res, next);
      expect(NotifyClient.prototype.sendEmail)
        .toHaveBeenCalledWith('456-789', 'test@example.com', emailProps);
    });

    test('problem notes formats corrected date of birth details', async () => {
      req.sessionModel.set('problem', ['problem-date-of-birth']);
      req.sessionModel.set('correct-date-of-birth', '1987-08-14');

      await instance.saveValues(req, res, next);

      const sentProps = NotifyClient.prototype.sendEmail.mock.calls[0][2];
      expect(sentProps.personalisation.problem_notes).toBe('Date of birth: 14/08/1987\n\n');
    });

    test('saveValues uses in-uk and is-refugee false branches', async () => {
      req.sessionModel.set('in-uk', 'yes');
      req.sessionModel.set('booked-travel', 'no');
      req.sessionModel.set('is-refugee', 'no');

      await instance.saveValues(req, res, next);

      const sentProps = NotifyClient.prototype.sendEmail.mock.calls[0][2];
      expect(sentProps.personalisation).toMatchObject({
        is_not_in_uk: 'no',
        booked_travel: '',
        is_booked_travel: '',
        booked_travel_date_to_uk: '',
        premium: '',
        travel_doc_number: '',
        travel_doc_nationality: '',
        travel_doc_dob: '',
        asylum_support: ''
      });
    });

    test('Notify errors are detected and passed to next()', async () => {
      NotifyClient.prototype.sendEmail = jest.fn().mockRejectedValue(new Error('Notify error'));
      await instance.saveValues(req, res, next);
      expect(NotifyClient.prototype.sendEmail).toHaveBeenCalled();
      expect(next).toHaveBeenCalled;
      expect(next).toHaveBeenCalledWith(new Error('Notify error'));
    });
  });

  test('Email props omit emailReplyToId when config replyToId is not set', async () => {
    jest.resetModules();

    jest.doMock('../../config.js', () => {
      const originalModule = jest.requireActual('../../config.js');
      return {
        ...originalModule,
        govukNotify: {
          notifyApiKey: 'test',
          caseworkerEmail: 'sas-hof-test@digital.homeoffice.gov.uk',
          userConfirmationTemplateId: '123-456',
          businessConfirmationTemplateId: '456-789',
          replyToId: undefined
        }
      };
    });

    const BehaviourNoReplyTo = require('../../apps/eec/behaviours/submit-request');
    const NotifyClientNoReplyTo = require('notifications-node-client').NotifyClient;

    class LocalBase {
      saveValues() {}
    }

    const localReq = reqres.req();
    const localRes = reqres.res();
    const localNext = jest.fn();
    LocalBase.prototype.saveValues = jest.fn().mockReturnValue(localReq, localRes, localNext);
    NotifyClientNoReplyTo.prototype.sendEmail = jest.fn().mockResolvedValue({ data: {} });

    localReq.form = {
      options: {
        steps: {
          '/photo': {
            fields: ['photo']
          }
        }
      }
    };

    localReq.sessionModel = new Model({
      problem: ['problem-photo'],
      'in-uk': 'no',
      'booked-travel': 'yes',
      'booked-travel-date-to-uk': '2025-06-24',
      premium: ['premium-super-priority'],
      'travel-doc-number': '120383978A',
      'travel-doc-nationality': 'France',
      'travel-doc-dob': '1987-08-14',
      'accessing-evisa': 'yes',
      'trying-to-do': ['trying-to-report-error'],
      'requestor-full-name': 'test user',
      'requestor-dob': '1987-08-14',
      'requestor-nationality': 'France',
      'formatted-reference': 'I do not have a reference',
      'is-refugee': 'no',
      'requestor-contact-method': 'email',
      'requestor-email': 'sas-hof-test@digital.homeoffice.gov.uk',
      'completing-for-someone-else': 'no',
      photo: 'photo bad'
    });

    const LocalSubmitRequest = BehaviourNoReplyTo(LocalBase);
    const localInstance = new LocalSubmitRequest();
    await localInstance.saveValues(localReq, localRes, localNext);

    const sentProps = NotifyClientNoReplyTo.prototype.sendEmail.mock.calls[0][2];
    expect(sentProps.emailReplyToId).toBe(undefined);

    jest.dontMock('../../config.js');
  });
});
