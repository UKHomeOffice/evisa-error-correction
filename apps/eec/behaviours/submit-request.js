const config = require('../../../config');
const logger = require('hof/lib/logger')({ env: config.env });
const {
  notifyApiKey,
  caseworkerEmail,
  userConfirmationTemplateId,
  businessConfirmationTemplateId,
  replyToId
} = config.govukNotify;

const { getLabel, formatDate } = require('../../../utils');

const NotifyClient = require('notifications-node-client').NotifyClient;
const Notify = new NotifyClient(notifyApiKey);

const genErrorMsg = error => {
  const errorDetails = error.response?.data ? `Cause: ${JSON.stringify(error.response.data)}` : '';
  const errorCode = error.code ? `${error.code} -` : '';
  return `${errorCode} ${error.message}; ${errorDetails}`;
};

class EmailProps {
  constructor(req) {
    this.personalisation = {
      full_name: req.sessionModel.get('detail-full-name') ?? req.sessionModel.get('requestor-full-name')
    };
    if (replyToId) {
      this.emailReplyToId = replyToId;
    }
  }

  addPersonalisation(newPersonalisation) {
    Object.assign(this.personalisation, newPersonalisation);
  }
}

const buildProblemNotes = (req) => {
  const problems = req.sessionModel.get('problem');
  let concatProblems = ''

  for (problem of problems) {
    concatProblems += getLabel('problem', problem) + ': ';
    concatProblems += req.sessionModel.get(problem.replace('problem', 'detail')) + '\n\n'
  }

  console.log('PROBLEMS: ', concatProblems);
  return concatProblems;
};

module.exports = superclass => class extends superclass {
  async saveValues(req, res, next) {
    const businessEmailProps = new EmailProps(req);
    const userContactEmail = req.sessionModel.get('requestor-email') || req.sessionModel.get('representative-email');

    const additionalProps = {
      full_name: req.sessionModel.get('requestor-full-name'),
      date_of_birth: formatDate(req.sessionModel.get('requestor-dob')),
      nationality: req.sessionModel.get('requestor-nationality'),
      reference: req.sessionModel.get('formatted-reference'),
      problem_notes: buildProblemNotes(req),
      contact_email: userContactEmail ?? 'none provided',
      contact_address: req.sessionModel.get('formatted-address') ?? 'none provided',
      completing_for_someone_else: getLabel(
        'completing-for-someone-else', req.sessionModel.get('completing-for-someone-else')
      )
    };

    businessEmailProps.addPersonalisation(additionalProps);

    try {
      await Notify.sendEmail(businessConfirmationTemplateId, caseworkerEmail, businessEmailProps);
      logger.info('EEC request caseworker email sent successfully');
    } catch (error) {
      logger.error(`Failed to send EEC request email: ${genErrorMsg(error)}`);
      return next(error);
    }

    if (userContactEmail) {
      const userEmailProps = new EmailProps(req);

      try {
        await Notify.sendEmail(userConfirmationTemplateId, userContactEmail, userEmailProps);
        logger.info('EEC requestor acknowledgement email sent successfully');
      } catch (error) {
        logger.warn(`Failed to send EEC user acknowledgement email: ${genErrorMsg(error)}`);
      }
    }

    return super.saveValues(req, res, next);
  }
};
