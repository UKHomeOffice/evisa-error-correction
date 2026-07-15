// Canonical problem order for the eVisa journey.
// Targets are route fragments without a leading '/'.
const PROBLEM_ORDER = [
  { key: 'problem-full-name', target: 'your-correct-name', order: 1 },
  { key: 'problem-date-of-birth', target: 'correct-date-of-birth', order: 2 },
  { key: 'problem-nationality', target: 'correct-nationality', order: 3 },
  { key: 'problem-status', target: 'problem-immigration-status', order: 4 },
  { key: 'problem-valid-from', target: 'date-valid-from', order: 5 },
  { key: 'problem-valid-to', target: 'date-valid-to', order: 6 },
  { key: 'problem-national-insurance-number', target: 'national-insurance-number', order: 7 },
  { key: 'problem-sponsor-licence-number', target: 'sponsor-licence-number', order: 8 },
  { key: 'problem-photo', target: 'photo', order: 9 },
  { key: 'problem-future-partner-name', target: 'future-partner-name', order: 10 },
  { key: 'problem-accompanying-adult-details', target: 'how-many-adults', order: 11 },
  { key: 'problem-ship-and-port-details', target: 'correct-ship-and-port', order: 12 },
  { key: 'problem-flight-number-airport', target: 'correct-flight-number-airport', order: 13 },
  { key: 'problem-restrictions-in-uk', target: 'details-can-do-uk', order: 14 },
  { key: 'problem-share-code', target: 'share-code', order: 15 },
  { key: 'problem-signin-email', target: 'correct-email-address', order: 16 },
  { key: 'problem-signin-phone', target: 'correct-phone-number', order: 17 },
  { key: 'problem-other', target: 'problem-not-listed', order: 18 }
];

module.exports = {
  PROBLEM_ORDER
};
