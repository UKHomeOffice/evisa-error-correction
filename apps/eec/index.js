module.exports = {
  name: 'eec',
  baseUrl: '/',
  params: '/:action?/:id?/:edit?',
  confirmStep: '/check-answers',
  steps: {
    '/problem': {
      next: '/personal-details',
      fields: []
    },
    '/personal-details': {
      next: '/contact',
      fields: []
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
