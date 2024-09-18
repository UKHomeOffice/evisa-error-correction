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
        'reporter-full-name',
        'reporter-dob',
        'reporter-nationality',
        'reporter-reference-type',
        'reporter-brp',
        'reporter-gwf',
        'reporter-uan',
        'reporter-passport'
      ]
    },
    '/contact': {
      next: '/someone-else',
      fields: []
    },
    '/someone-else': {
      next: '/check-answers',
      fields: []
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
