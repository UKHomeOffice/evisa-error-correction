const config = require('../../../config');
const {
  notifyApiKey,
  caseworkerEmail,
  businessConfirmationTemplateId,
  replyToId
} = config.govukNotify;

const { getLabel, formatDate, genNotifyErrorMsg, joinNonEmpty } = require('../../../utils');
const { getFieldsForProblemKey } = require('../../../utils/problem-utils');

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
  const dateDetailProblemKeys = [
    'problem-date-of-birth',
    'problem-valid-from',
    'problem-valid-to'
  ];
  const spaceSeparatorProblemKeys = [
    'problem-full-name',
    'problem-future-partner-name'
  ];

  // A single checked box will be stored as a string not an array of length 1 so...
  if (typeof problems === 'string') {
    problems = Array.of(problems);
  }

  const buildAccompanyingAdultDetailsNote = () => {
    const adultsValue = req.sessionModel.get('how-many-adults');
    const adultsValueLabel = getLabel('how-many-adults', adultsValue) || adultsValue || '';
    const adultsCountLabel = getLabel('how-many-adults', undefined, 'confirm-field');
    const oneAdultLabel = getLabel('correct-given-names-adult-accompanying', undefined, 'confirm-field');
    const twoAdultsLabel = getLabel('correct-passport-number-adult-1', undefined, 'confirm-field');
    const lines = [
      `${adultsCountLabel}: ${adultsValueLabel}\n\n`
    ];

    if (adultsValue === '1-adult') {
      const givenNames = req.sessionModel.get('correct-given-names-adult-accompanying');
      const lastName = req.sessionModel.get('correct-last-name-adult-accompanying');
      const fullName = joinNonEmpty([givenNames, lastName]);
      const passport = req.sessionModel.get('correct-passport-number-adult-accompanying');

      lines.push(`${oneAdultLabel}:`);
      if (fullName) {
        lines.push(fullName);
      }
      if (passport) {
        lines.push(passport);
      }
    }

    if (adultsValue === '2-adults') {
      const passport1 = req.sessionModel.get('correct-passport-number-adult-1');
      const passport2 = req.sessionModel.get('correct-passport-number-adult-2');

      lines.push(`${twoAdultsLabel}:`);
      if (passport1) {
        lines.push(`Adult 1: ${passport1}`);
      }
      if (passport2) {
        lines.push(`Adult 2: ${passport2}`);
      }
    }

    return lines.join('\n');
  };

  for (const problem of problems) {
    if (problem === 'problem-accompanying-adult-details') {
      concatProblems += buildAccompanyingAdultDetailsNote() + '\n\n';
      continue;
    }

    concatProblems += getLabel('problem', problem) + ': ';
    const fieldValues = getFieldsForProblemKey(req, problem)
      .map(fieldName => {
        const rawValue = req.sessionModel.get(fieldName);
        const value = dateDetailProblemKeys.includes(problem) ? formatDate(rawValue) : rawValue;
        return value;
      });

    const separator = spaceSeparatorProblemKeys.includes(problem) ? ' ' : ', ';
    const detail = fieldValues.join(separator);
    concatProblems += detail + '\n\n';
  }

  return concatProblems;
};

module.exports = superclass => class extends superclass {
  async saveValues(req, res, next) {
    const businessEmailProps = new EmailProps;

    try {
      businessEmailProps.addPersonalisation({
        in_uk: getLabel('in-uk', req.sessionModel.get('in-uk')),
        is_not_in_uk: req.sessionModel.get('in-uk') === 'no' ? 'yes' : 'no',
        booked_travel: req.sessionModel.get('in-uk') === 'no' ?
          getLabel('booked-travel', req.sessionModel.get('booked-travel')) : '',
        is_booked_travel: req.sessionModel.get('in-uk') === 'no' ?
          req.sessionModel.get('booked-travel') : '',
        booked_travel_date_to_uk: req.sessionModel.get('booked-travel') === 'yes' ?
          formatDate(req.sessionModel.get('booked-travel-date-to-uk')) : '',
        premium: req.sessionModel.get('in-uk') === 'no' ?
          getLabel('premium', req.sessionModel.get('premium')) : '',
        evisa_error_description_provided: req.sessionModel.get('describe-evisa-error') ? 'yes' : 'no',
        describe_evisa_error: req.sessionModel.get('describe-evisa-error') || '',
        travel_doc_number: req.sessionModel.get('in-uk') === 'no' ?
          req.sessionModel.get('travel-doc-number') : '',
        travel_doc_nationality: req.sessionModel.get('in-uk') === 'no' ?
          req.sessionModel.get('travel-doc-nationality') : '',
        travel_doc_dob: req.sessionModel.get('in-uk') === 'no' ?
          formatDate(req.sessionModel.get('travel-doc-dob')) : '',
        accessing_evisa: getLabel('accessing-evisa', req.sessionModel.get('accessing-evisa')),
        accessing_evisa_possible: req.sessionModel.get('accessing-evisa'),
        trying_to_do: req.sessionModel.get('accessing-evisa') === 'yes' ?
          getLabel('trying-to-do', req.sessionModel.get('trying-to-do')) : '',
        full_name: req.sessionModel.get('requestor-full-name'),
        date_of_birth: formatDate(req.sessionModel.get('requestor-dob')),
        nationality: req.sessionModel.get('requestor-nationality'),
        reference: req.sessionModel.get('formatted-reference'),
        is_refugee: getLabel('is-refugee', req.sessionModel.get('is-refugee')),
        asylum_support: req.sessionModel.get('is-refugee') === 'yes' ?
          getLabel('asylum-support', req.sessionModel.get('asylum-support')) : '',
        corrected_evisa_details: req.sessionModel.get('problem') ? 'yes' : 'no',
        problem_notes: req.sessionModel.get('problem') ? buildProblemNotes(req) : '',
        contact_email: req.sessionModel.get('requestor-contact-method') === 'email' ?
          req.sessionModel.get('requestor-email') : 'none provided',
        contact_address: req.sessionModel.get('requestor-contact-method') === 'uk-address' ?
          req.sessionModel.get('formatted-address') : 'none provided',
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

    return super.saveValues(req, res, next);
  }
};
