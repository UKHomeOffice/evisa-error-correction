const { getLabel, formatDate, joinNonEmpty } = require('./index');
const {
  getFieldsForProblemKey,
  getFieldsForRoutes,
  getInternalRoutesForProblemKey
} = require('./problem-utils');

const dateKeysToFormat = [
  'problem-date-of-birth',
  'problem-valid-from',
  'problem-valid-to'
];

const spaceSeparatorKeys = [
  'problem-full-name',
  'problem-future-partner-name',
  'correct-given-names-adult-accompanying'
];

// const buildAccompanyingAdultDetailsNote1 = req => {
//   const adultsValue = req.sessionModel.get('how-many-adults');
//   const adultsValueLabel = getLabel('how-many-adults', adultsValue) || adultsValue || '';
//   const adultsCountLabel = getLabel('how-many-adults', undefined, 'confirm-field');
//   let adultLabel = '';
//   let adultDetails = '';

//   const lines = [
//     `${adultsCountLabel}: ${adultsValueLabel}\n\n`
//   ];

//   if (adultsValue === '1-adult') {
//     adultLabel = getLabel('correct-given-names-adult-accompanying', undefined, 'confirm-field');
//     const givenNames = req.sessionModel.get('correct-given-names-adult-accompanying');
//     const lastName = req.sessionModel.get('correct-last-name-adult-accompanying');
//     const passportNumber = req.sessionModel.get('correct-passport-number-adult-accompanying');
//     const fullName = joinNonEmpty([givenNames, lastName]);
//     adultDetails = joinNonEmpty([fullName, passportNumber], '\n');
//   }

//   if (adultsValue === '2-adults') {
//     adultLabel = getLabel('correct-passport-number-adult-1', undefined, 'confirm-field');
//     const passportNumber1 = req.sessionModel.get('correct-passport-number-adult-1');
//     const passportNumber2 = req.sessionModel.get('correct-passport-number-adult-2');
//     const adult1 = passportNumber1 ? `Adult 1: ${passportNumber1}` : null;
//     const adult2 = passportNumber2 ? `Adult 2: ${passportNumber2}` : null;
//     adultDetails = joinNonEmpty([adult1, adult2], '\n');
//   }
//   lines.push(`${adultLabel}:`);
//   if (adultDetails) {
//     lines.push(adultDetails);
//   }

//   return lines.join('\n');
// };

const buildAccompanyingAdultDetailsNote = req => {
  const adultsValue = req.sessionModel.get('how-many-adults');
  const adultsValueLabel = getLabel('how-many-adults', adultsValue) || adultsValue || '';
  const adultsCountLabel = getLabel('how-many-adults', undefined, 'confirm-field');
  let adultLabel = '';
  let adultDetails = '';

  const lines = [
    `${adultsCountLabel}: ${adultsValueLabel}\n\n`
  ];

  const internalAdultRoutes = getInternalRoutesForProblemKey(req, 'problem-accompanying-adult-details', 'selected');
  const fieldsForRoutes = getFieldsForRoutes(req, internalAdultRoutes);

  fieldsForRoutes.forEach((fieldName, index) => {
    if (index === 0) {
      adultLabel = getLabel(fieldName, undefined, 'confirm-field');
    }

    const fieldValue = req.sessionModel.get(fieldName);
    const separator = spaceSeparatorKeys.includes(fieldName) ? ' ' : '\n';
    let formattedFieldValue = fieldValue;
    if (adultsValue === '2-adults') {
      formattedFieldValue = fieldValue ? `Adult ${index + 1}: ${fieldValue}` : null;
    }

    adultDetails += `${formattedFieldValue}${separator}`;
  });

  lines.push(`${adultLabel}:`);
  if (adultDetails) {
    lines.push(adultDetails);
  }

  return lines.join('\n');
};

const buildProblemNotes = req => {
  let problems = req.sessionModel.get('problem');
  let concatProblems = '';

  // A single checked box will be stored as a string not an array of length 1 so...
  if (typeof problems === 'string') {
    problems = Array.of(problems);
  }

  for (const problem of problems) {
    if (problem === 'problem-accompanying-adult-details') {
      concatProblems += buildAccompanyingAdultDetailsNote(req) + '\n\n';
      continue;
    }

    concatProblems += getLabel('problem', problem) + ': ';
    const fieldValues = getFieldsForProblemKey(req, problem)
      .map(fieldName => {
        const rawValue = req.sessionModel.get(fieldName);
        const value = dateKeysToFormat.includes(problem) ? formatDate(rawValue) : rawValue;
        return value;
      });

    const separator = spaceSeparatorKeys.includes(problem) ? ' ' : ', ';
    const detail = fieldValues.join(separator);
    concatProblems += detail + '\n\n';
  }

  return concatProblems;
};

module.exports = {
  buildProblemNotes
};
