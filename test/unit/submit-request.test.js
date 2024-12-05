const Behaviour = require('../../apps/eec/behaviours/submit-request');
const reqres = require('hof').utils.reqres;
const Model = require('hof').model;

jest.mock('../../config.js', () => {
  const originalModule = jest.requireActual('../../config.js');
  return {
    ...originalModule,
    govukNotify: {
      notifyApiKey: 'test',
      caseworkerEmail: 'sas-hof-test@digital.homeoffice.gov.uk',
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

      req.sessionModel = new Model({
        problem: ['problem-photo', 'problem-nin'],
        'in-uk': 'yes',
        'viewing-evisa': 'no',
        'detail-photo': 'photo bad',
        'detail-nin': 'QQ123456A',
        'requestor-full-name': 'test user',
        'requestor-dob': '1987-08-14',
        'requestor-nationality': 'France',
        'formatted-reference': 'I do not have a reference',
        'is-refugee': 'yes',
        'requestor-contact-method': 'email',
        'requestor-email': 'sas-hof-test@digital.homeoffice.gov.uk',
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

    test('Notify sendEmail should be called twice when \'requestor-email\' is set ', async () => {
      await instance.saveValues(req, res, next);
      expect(NotifyClient.prototype.sendEmail).toHaveBeenCalledTimes(2);
    });

    test('Notify sendEmail should be called once when \'requestor-email\' is not set ', async () => {
      req.sessionModel.set('requestor-email', undefined);
      await instance.saveValues(req, res, next);
      expect(NotifyClient.prototype.sendEmail).toHaveBeenCalledTimes(1);
    });

    test('Notify sendEmail to user is called with the correct props', async () => {
      emailProps = {
        personalisation: {
          full_name: 'test user'
        },
        emailReplyToId: '789-123'
      };
      await instance.saveValues(req, res, next);
      expect(NotifyClient.prototype.sendEmail)
        .toHaveBeenLastCalledWith('123-456', 'sas-hof-test@digital.homeoffice.gov.uk', emailProps);
    });

    test('Notify sendEmail to business is called with the correct props', async () => {
      emailProps = {
        personalisation: {
          in_uk: 'Yes',
          is_not_viewing_evisa: 'yes',
          viewing_evisa: 'No, the problem is something else',
          full_name: 'test user',
          date_of_birth: '14/08/1987',
          nationality: 'France',
          reference: 'I do not have a reference',
          is_refugee: 'Yes',
          problem_notes: 'Photo: photo bad\n\nNational Insurance number: QQ123456A\n\n',
          contact_email: 'sas-hof-test@digital.homeoffice.gov.uk',
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
        .toHaveBeenCalledWith('456-789', 'sas-hof-test@digital.homeoffice.gov.uk', emailProps);
    });

    test('Business sendEmail is called with the correct props if only one problem had been added', async () => {
      req.sessionModel.set('problem', 'problem-full-name');
      req.sessionModel.set('detail-full-name', 'Corrected name');
      req.sessionModel.unset('detail-photo');
      req.sessionModel.unset('detail-nin');

      emailProps = {
        personalisation: {
          in_uk: 'Yes',
          is_not_viewing_evisa: 'yes',
          viewing_evisa: 'No, the problem is something else',
          full_name: 'test user',
          date_of_birth: '14/08/1987',
          nationality: 'France',
          reference: 'I do not have a reference',
          is_refugee: 'Yes',
          problem_notes: 'Full name: Corrected name\n\n',
          contact_email: 'sas-hof-test@digital.homeoffice.gov.uk',
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
        .toHaveBeenCalledWith('456-789', 'sas-hof-test@digital.homeoffice.gov.uk', emailProps);
    });

    test('Business sendEmail is called with the correct props if contact method is address', async () => {
      req.sessionModel.set('requestor-contact-method', 'uk-address');

      emailProps = {
        personalisation: {
          in_uk: 'Yes',
          is_not_viewing_evisa: 'yes',
          viewing_evisa: 'No, the problem is something else',
          full_name: 'test user',
          date_of_birth: '14/08/1987',
          nationality: 'France',
          reference: 'I do not have a reference',
          is_refugee: 'Yes',
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
        .toHaveBeenCalledWith('456-789', 'sas-hof-test@digital.homeoffice.gov.uk', emailProps);
    });

    test('Notify errors are detected and passed to next()', async () => {
      NotifyClient.prototype.sendEmail = jest.fn().mockRejectedValue(new Error('Notify error'));
      await instance.saveValues(req, res, next);
      expect(NotifyClient.prototype.sendEmail).toHaveBeenCalled();
      expect(next).toHaveBeenCalled;
      expect(next).toHaveBeenCalledWith(new Error('Notify error'));
    });
  });
});
