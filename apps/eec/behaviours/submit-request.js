const config = require('../../../config');
const {
  notifyApiKey,
  caseworkerEmail,
  userConfirmationTemplateId,
  businessConfirmationTemplateId,
  replyToId
} = config.govukNotify;

const { getLabel, formatDate, genNotifyErrorMsg } = require('../../../utils');

const NotifyClient = require('notifications-node-client').NotifyClient;
const Notify = new NotifyClient(notifyApiKey);

class EmailProps {
  constructor() {
    this.personalisation = {};
    if (replyToId) {
      this.emailReplyToId = replyToId;
    }
  }

  addPersonalisation(newPersonalisation) {
    Object.assign(this.personalisation, newPersonalisation);
  }
}

const buildProblemNotes = req => {
  let problems = req.sessionModel.get('problem');
  let concatProblems = '';

  // A single checked box will be stored as a string not an array of length 1 so...
  if (typeof problems === 'string') {
    problems = Array.of(problems);
  }

  for (const problem of problems) {
    concatProblems += getLabel('problem', problem) + ': ';
    concatProblems += req.sessionModel.get(problem.replace('problem', 'detail')) + '\n\n';
  }

  return concatProblems;
};

module.exports = superclass => class extends superclass {
  async saveValues(req, res, next) {
    const businessEmailProps = new EmailProps;

    try {
      businessEmailProps.addPersonalisation({
        full_name: req.sessionModel.get('requestor-full-name'),
        date_of_birth: formatDate(req.sessionModel.get('requestor-dob')),
        nationality: req.sessionModel.get('requestor-nationality'),
        reference: req.sessionModel.get('formatted-reference'),
        problem_notes: buildProblemNotes(req),
        contact_email: req.sessionModel.get('requestor-email') || 'none provided',
        contact_address: req.sessionModel.get('formatted-address') || 'none provided',
        completing_for_someone_else: getLabel(
          'completing-for-someone-else', req.sessionModel.get('completing-for-someone-else')
        ),
        representative_name: req.sessionModel.get('representative-name') ?? '',
        representative_email: req.sessionModel.get('representative-email') ?? '',
        representative_type: getLabel('representative-type', req.sessionModel.get('representative-type')) ?? ''
      });

      await Notify.sendEmail(businessConfirmationTemplateId, caseworkerEmail, businessEmailProps);
      req.log('info', 'EEC request caseworker email sent successfully');
    } catch (error) {
      req.log('error', `Failed to send EEC request email: ${genNotifyErrorMsg(error)}`);
      return next(error);
    }

    const userContactEmail = req.sessionModel.get('requestor-email');

    if (userContactEmail) {
      const userEmailProps = new EmailProps;

      try {
        userEmailProps.addPersonalisation({
          full_name: req.sessionModel.get('detail-full-name') || req.sessionModel.get('requestor-full-name')
        });

        await Notify.sendEmail(userConfirmationTemplateId, userContactEmail, userEmailProps);
        req.log('info', 'EEC requestor acknowledgement email sent successfully');
      } catch (error) {
        req.log('warn', `Failed to send EEC user acknowledgement email: ${genNotifyErrorMsg(error)}`);
      }
    }

    return super.saveValues(req, res, next);
  }
};