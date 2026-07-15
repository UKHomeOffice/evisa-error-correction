const hof = require('hof');
const Summary = hof.components.summary;
const submitRequest = require('./behaviours/submit-request');
const validateAutocomplete = require('./behaviours/validate-autocomplete');
const captureProblemSelection = require('./behaviours/capture-problem-selection');
const problemBackLink = require('./behaviours/problem-back-link');
const { buildProblemForks } = require('../../utils/build-problem-forks');
const clearProblemSession = require('./behaviours/clear-problem-session');
const { disallowIndexing } = require('../../config');

const pages = {
  '/accessibility': 'static/accessibility'
};

if (disallowIndexing) {
  pages['/robots.txt'] = 'static/robots';
}

module.exports = {
  name: 'eec',
  baseUrl: '/',
  params: '/:action?/:id?/:edit?',
  confirmStep: '/check-your-answers',
  steps: {
    '/in-uk': {
      next: '/accessing-evisa',
      fields: ['in-uk'],
      showNeedHelp: true,
      forks: [
        {
          target: '/booked-travel',
          condition: {
            field: 'in-uk',
            value: 'no'
          }
        }
      ]
    },
    '/booked-travel': {
      next: '/travel-document-details',
      fields: [
        'booked-travel',
        'booked-travel-date-to-uk'
      ],
      showNeedHelp: true
    },
    '/travel-document-details': {
      next: '/premium',
      fields: [
        'travel-doc-number',
        'travel-doc-nationality',
        'travel-doc-dob'
      ],
      behaviours: [validateAutocomplete('travel-doc-nationality')],
      showNeedHelp: true
    },
    '/premium': {
      next: '/accessing-evisa',
      fields: [
        'premium'
      ],
      showNeedHelp: true
    },
    '/accessing-evisa': {
      next: '/trying-to-do',
      fields: ['accessing-evisa'],
      showNeedHelp: true,
      continueOnEdit: true,
      forks: [
        {
          target: '/before-reporting',
          condition: {
            field: 'accessing-evisa',
            value: 'no'
          }
        }
      ]
    },
    '/trying-to-do': {
      next: '/problem',
      fields: ['trying-to-do'],
      showNeedHelp: true,
      continueOnEdit: true,
      forks: [
        {
          target: '/prove-status-before-reporting',
          condition: {
            field: 'trying-to-do',
            value: 'trying-to-prove-status'
          }
        },
        {
          target: '/update-details-before-reporting',
          condition: {
            field: 'trying-to-do',
            value: 'trying-to-update-details'
          }
        }
      ]
    },
    '/prove-status-before-reporting': {
      next: '/problem',
      showNeedHelp: true,
      continueOnEdit: true
    },
    '/update-details-before-reporting': {
      next: '/problem',
      showNeedHelp: true,
      continueOnEdit: true
    },
    '/before-reporting': {
      next: '/more-details',
      fields: ['problem-redirect'],
      showNeedHelp: true,
      forks: [
        {
          target: '/problem',
          condition: {
            field: 'problem-redirect',
            value: 'yes'
          }
        }
      ]
    },
    '/more-details': {
      next: '/your-evisa-details',
      fields: ['describe-evisa-error'],
      showNeedHelp: true
    },
    '/problem': {
      next: '/your-evisa-details',
      fields: [
        'problem'
      ],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks(),
      showNeedHelp: true
    },
    '/your-correct-name': {
      next: '/your-evisa-details',
      fields: [
        'correct-given-names',
        'correct-last-name'
      ],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-full-name'),
      showNeedHelp: true
    },
    '/correct-date-of-birth': {
      next: '/your-evisa-details',
      fields: ['correct-date-of-birth'],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-date-of-birth'),
      showNeedHelp: true
    },
    '/correct-nationality': {
      next: '/your-evisa-details',
      fields: ['correct-nationality'],
      behaviours: [
        validateAutocomplete('correct-nationality'),
        captureProblemSelection,
        problemBackLink
      ],
      forks: buildProblemForks('problem-nationality'),
      showNeedHelp: true
    },
    '/problem-immigration-status': {
      next: '/your-evisa-details',
      fields: ['problem-immigration-status'],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-status'),
      showNeedHelp: true
    },
    '/date-valid-from': {
      next: '/your-evisa-details',
      fields: ['correct-visa-start-date'],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-valid-from'),
      showNeedHelp: true
    },
    '/date-valid-to': {
      next: '/your-evisa-details',
      fields: ['correct-visa-end-date'],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-valid-to'),
      showNeedHelp: true
    },
    '/national-insurance-number': {
      next: '/your-evisa-details',
      fields: ['correct-national-insurance-number'],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-national-insurance-number'),
      showNeedHelp: true
    },
    '/sponsor-licence-number': {
      next: '/your-evisa-details',
      fields: ['correct-sponsor-licence-number'],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-sponsor-licence-number'),
      showNeedHelp: true
    },
    '/photo': {
      next: '/your-evisa-details',
      fields: ['photo'],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-photo'),
      showNeedHelp: true
    },
    '/future-partner-name': {
      next: '/your-evisa-details',
      fields: [
        'future-partner-correct-given-names',
        'future-partner-correct-last-name'
      ],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-future-partner-name'),
      showNeedHelp: true
    },
    '/how-many-adults': {
      next: '/your-evisa-details',
      fields: ['how-many-adults'],
      behaviours: [captureProblemSelection, problemBackLink],
      showNeedHelp: true,
      forks: [
        {
          target: '/correct-details-adult-accompanying',
          continueOnEdit: true,
          condition: {
            field: 'how-many-adults',
            value: '1-adult'
          }
        },
        {
          target: '/correct-passport-number',
          continueOnEdit: true,
          condition: {
            field: 'how-many-adults',
            value: '2-adults'
          }
        }
      ]
    },
    '/correct-details-adult-accompanying': {
      next: '/your-evisa-details',
      fields: [
        'correct-given-names-adult-accompanying',
        'correct-last-name-adult-accompanying',
        'correct-passport-number-adult-accompanying'
      ],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-accompanying-adult-details'),
      showNeedHelp: true
    },
    '/correct-passport-number': {
      next: '/your-evisa-details',
      fields: [
        'correct-passport-number-adult-1',
        'correct-passport-number-adult-2'
      ],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-accompanying-adult-details'),
      showNeedHelp: true
    },
    '/correct-ship-and-port': {
      next: '/your-evisa-details',
      fields: [
        'correct-ship-name',
        'correct-port-name'
      ],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-ship-and-port-details'),
      showNeedHelp: true
    },
    '/details-can-do-uk': {
      next: '/your-evisa-details',
      fields: ['detail-restrictions-in-uk'],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-restrictions-in-uk'),
      showNeedHelp: true
    },
    '/correct-flight-number-airport': {
      next: '/your-evisa-details',
      fields: [
        'correct-flight-number',
        'correct-airport'
      ],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-flight-number-airport'),
      showNeedHelp: true
    },
    '/share-code': {
      next: '/your-evisa-details',
      fields: ['detail-share-code'],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-share-code'),
      showNeedHelp: true
    },
    '/correct-email-address': {
      next: '/your-evisa-details',
      fields: ['correct-signin-email'],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-signin-email'),
      showNeedHelp: true
    },
    '/correct-phone-number': {
      next: '/your-evisa-details',
      fields: ['correct-signin-phone'],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-signin-phone'),
      showNeedHelp: true
    },
    '/problem-not-listed': {
      next: '/your-evisa-details',
      fields: ['problem-not-listed'],
      behaviours: [captureProblemSelection, problemBackLink],
      forks: buildProblemForks('problem-other'),
      showNeedHelp: true
    },
    '/your-evisa-details': {
      next: '/refugee',
      fields: [
        'requestor-full-name',
        'requestor-dob',
        'requestor-nationality',
        'requestor-reference-type',
        'requestor-brp',
        'requestor-gwf',
        'requestor-uan',
        'requestor-passport',
        'requestor-ukvi'
      ],
      behaviours: [
        validateAutocomplete('requestor-nationality'),
        captureProblemSelection,
        problemBackLink
      ],
      showNeedHelp: true
    },
    '/refugee': {
      next: '/contact',
      fields: ['is-refugee'],
      showNeedHelp: true,
      forks: [
        {
          target: '/asylum-support',
          condition: {
            field: 'is-refugee',
            value: 'yes'
          }
        }
      ]
    },
    '/asylum-support': {
      next: '/contact',
      fields: ['asylum-support'],
      showNeedHelp: true
    },
    '/contact': {
      next: '/someone-else',
      fields: [
        'requestor-contact-method',
        'requestor-email',
        'requestor-address-line-1',
        'requestor-address-line-2',
        'requestor-town-or-city',
        'requestor-county',
        'requestor-postcode'
      ],
      showNeedHelp: true
    },
    '/someone-else': {
      next: '/check-your-answers',
      fields: ['completing-for-someone-else'],
      forks: [
        {
          target: '/someone-else-details',
          condition: {
            field: 'completing-for-someone-else',
            value: 'yes'
          }
        }
      ],
      showNeedHelp: true
    },
    '/someone-else-details': {
      next: '/check-your-answers',
      fields: [
        'representative-name',
        'representative-email',
        'representative-type'
      ],
      showNeedHelp: true
    },
    '/check-your-answers': {
      behaviours: [Summary, clearProblemSession, submitRequest],
      sections: require('./sections/summary-data-sections'),
      template: 'summary',
      next: '/request-sent'
    },
    '/request-sent': {
      clearSession: true,
      backLink: false
    },
    '/session-timeout': {},
    '/exit': {}
  },
  pages: pages
};
