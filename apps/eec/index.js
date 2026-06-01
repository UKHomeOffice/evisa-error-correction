const hof = require('hof');
const Summary = hof.components.summary;
const submitRequest = require('./behaviours/submit-request');
const validateAutocomplete = require('./behaviours/validate-autocomplete');
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
  confirmStep: '/check-answers',
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
      showNeedHelp: true
    },
    '/update-details-before-reporting': {
      next: '/problem',
      showNeedHelp: true
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
      next: '/personal-details',
      fields: ['describe-evisa-error'],
      showNeedHelp: true
    },
    '/problem': {
      next: '/personal-details',
      fields: [
        'problem',
        'detail-valid-from',
        'detail-valid-until',
        'detail-restrictions',
        'detail-share-code',
        'detail-signin-email',
        'detail-signin-phone',
        'detail-other'
      ],
      forks: [
        {
          target: '/your-correct-name',
          condition: req => {
            if ( req.sessionModel.get('problem') &&
            req.sessionModel.get('problem').includes('problem-full-name') ) {
              return true;
            }
            return false;
          }
        },
        {
          target: '/correct-date-of-birth',
          condition: req => req.sessionModel.get('problem') &&
          req.sessionModel.get('problem').includes('problem-date-of-birth')
        },
        {
          target: '/correct-nationality',
          condition: req => req.sessionModel.get('problem') &&
          req.sessionModel.get('problem').includes('problem-nationality')
        },
        {
          target: '/problem-immigration-status',
          condition: req => req.sessionModel.get('problem') &&
          req.sessionModel.get('problem').includes('problem-status')
        },
        {
          target: '/national-insurance-number',
          condition: req => req.sessionModel.get('problem') &&
          req.sessionModel.get('problem').includes('problem-national-insurance-number')
        },
        {
          target: '/sponsor-licence-number',
          condition: req => req.sessionModel.get('problem') &&
          req.sessionModel.get('problem').includes('problem-sponsor-licence-number')
        },
        {
          target: '/photo',
          condition: req => req.sessionModel.get('problem') &&
          req.sessionModel.get('problem').includes('problem-photo')
        },
        {
          target: '/future-partner-name',
          condition: req => req.sessionModel.get('problem') &&
          req.sessionModel.get('problem').includes('problem-future-partner-name')
        }
      ],
      showNeedHelp: true
    },
    '/your-correct-name': {
      next: '/personal-details',
      fields: [
        'correct-given-names',
        'correct-last-name'
      ],
      showNeedHelp: true
    },
    '/correct-date-of-birth': {
      next: '/personal-details',
      fields: ['correct-date-of-birth'],
      showNeedHelp: true
    },
    '/correct-nationality': {
      next: '/personal-details',
      fields: ['correct-nationality'],
      behaviours: [validateAutocomplete('correct-nationality')],
      showNeedHelp: true
    },
    '/problem-immigration-status': {
      next: '/personal-details',
      fields: ['problem-immigration-status'],
      showNeedHelp: true
    },
    '/national-insurance-number': {
      next: '/personal-details',
      fields: ['correct-national-insurance-number'],
      showNeedHelp: true
    },
    '/sponsor-licence-number': {
      next: '/personal-details',
      fields: ['correct-sponsor-licence-number'],
      showNeedHelp: true
    },
    '/photo': {
      next: '/personal-details',
      fields: ['photo'],
      showNeedHelp: true
    },
    '/future-partner-name': {
      next: '/personal-details',
      fields: [
        'future-partner-correct-given-names',
        'future-partner-correct-last-name'
      ],
      showNeedHelp: true
    },
    '/personal-details': {
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
      behaviours: [validateAutocomplete('requestor-nationality')],
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
      next: '/check-answers',
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
      next: '/check-answers',
      fields: [
        'representative-name',
        'representative-email',
        'representative-type'
      ],
      showNeedHelp: true
    },
    '/check-answers': {
      behaviours: [Summary, submitRequest],
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
