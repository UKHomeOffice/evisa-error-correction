const config = require('../../../config');
const logger = require('hof/lib/logger')({ env: config.env });
const {
  notifyApiKey,
  caseworkerEmail,
  userConfirmationTemplateId,
  businessConfirmationTemplateId,
  replyToId
} = config.govukNotify;

// const { getLabel } = require('../../../utils');

const NotifyClient = require('notifications-node-client').NotifyClient;
const Notify = new NotifyClient(notifyApiKey);

module.exports = superclass => class extends superclass {
  async saveValues(req, res, next) {
    const baseEmailProps = {
      full_name: req.sessionModel.get('requestor-full-name')
    };

    const caseworkerEmailProps = {
      ...baseEmailProps
    };

    try {
      await Notify.sendEmail(
        businessConfirmationTemplateId,
        caseworkerEmail,
        {
          personalisation: caseworkerEmailProps,
          emailReplyToId: replyToId
        }
      );
      logger.info('EEC request email sent successfully');

      const requestorEmail = req.sessionModel.get('requestor-email');

      if (requestorEmail) {
        await Notify.sendEmail(
          userConfirmationTemplateId,
          requestorEmail,
          {
            personalisation: baseEmailProps,
            emailReplyToId: replyToId
          }
        );
        logger.info('EEC requestor acknowledgement email sent successfully');
      }
    } catch (error) {
      const errorDetails = error.response?.data ? `Cause: ${JSON.stringify(error.response.data)}` : '';
      const errorCode = error.code ? `${error.code} -` : '';
      const errorMessage = `${errorCode} ${error.message}; ${errorDetails}`;

      logger.error(`Failed to send EEC request email: ${errorMessage}`);
      return next(error);
    }

    return super.saveValues(req, res, next);
  }
};
