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
      behaviours: [validateAutocomplete('requestor-nationality')],
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
      showNeedHelp: true
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
        'detail-full-name',
        'detail-dob',
        'detail-nationality',
        'detail-status',
        'detail-valid-from',
        'detail-valid-until',
        'detail-nin',
        'detail-photo',
        'detail-restrictions',
        'detail-share-code',
        'detail-signin-email',
        'detail-signin-phone',
        'detail-other'
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
    }
  },
  pages: pages
};
