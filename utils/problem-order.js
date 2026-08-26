// Source-of-truth problem definitions for the eVisa journey.
//
// Each definition includes:
// - `key`: problem identifier used in session/form values.
// - `target`: slash-prefixed canonical step route.
//
// Optional metadata for problems with internal branches:
// - `internalRouteSelector`: session field that selects a branch.
// - `internalRoutes`: selector-value -> route[] map for branch-specific steps.
//
// This metadata is consumed by routing/restore helpers to decide which internal
// routes and fields are considered in `all` vs `selected` mode.
const PROBLEM_DEFINITIONS = [
  { key: 'problem-full-name', target: '/your-correct-name' },
  { key: 'problem-date-of-birth', target: '/correct-date-of-birth' },
  { key: 'problem-nationality', target: '/correct-nationality' },
  { key: 'problem-status', target: '/problem-immigration-status' },
  { key: 'problem-valid-from', target: '/date-valid-from' },
  { key: 'problem-valid-to', target: '/date-valid-to' },
  { key: 'problem-national-insurance-number', target: '/national-insurance-number' },
  { key: 'problem-sponsor-licence-number', target: '/sponsor-licence-number' },
  { key: 'problem-photo', target: '/photo' },
  { key: 'problem-future-partner-name', target: '/future-partner-name' },
  {
    key: 'problem-accompanying-adult-details',
    target: '/how-many-adults',
    internalRouteSelector: 'how-many-adults',
    internalRoutes: {
      '1-adult': ['/correct-details-adult-accompanying'],
      '2-adults': ['/correct-passport-number']
    }
  },
  { key: 'problem-ship-and-port-details', target: '/correct-ship-and-port' },
  { key: 'problem-flight-number-airport', target: '/correct-flight-number-airport' },
  { key: 'problem-restrictions-in-uk', target: '/details-can-do-uk' },
  { key: 'problem-share-code', target: '/share-code' },
  { key: 'problem-signin-email', target: '/correct-email-address' },
  { key: 'problem-signin-phone', target: '/correct-phone-number' },
  { key: 'problem-other', target: '/problem-not-listed' }
];

// Exported ordered problem list used by routing and summary helpers.
// `order` is derived from array position to keep ordering in one place.
const PROBLEM_ORDER = PROBLEM_DEFINITIONS.map((problem, index) => ({
  ...problem,
  order: index + 1
}));

module.exports = {
  PROBLEM_ORDER
};
