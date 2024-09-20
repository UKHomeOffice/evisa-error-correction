module.exports = {
  name: 'eec',
  baseUrl: '/',
  params: '/:action?/:id?/:edit?',
  confirmStep: '/check-answers',
  steps: {
    '/problem': {
      next: '/personal-details',
      fields: [
        'problem',
        'detail-full-name',
        'detail-sponsor-ref',
        'detail-photo',
        'detail-nin',
        'detail-restrictions',
        'detail-status',
        'detail-valid-until'
      ]
    },
    '/personal-details': {
      next: '/contact',
      fields: [
        'requestor-full-name',
        'requestor-dob',
        'requestor-nationality',
        'requestor-reference-type',
        'requestor-brp',
        'requestor-gwf',
        'requestor-uan',
        'requestor-passport'
      ]
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
      ]
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
      ]
    },
    '/someone-else-details': {
      next: '/check-answers',
      fields: [
        'representative-name',
        'representative-email',
        'representative-type'
      ]
    },
    '/check-answers': {
      next: '/request-sent'
    },
    '/request-sent': {
      clearSession: true,
      backLink: false
    }
  }
};
