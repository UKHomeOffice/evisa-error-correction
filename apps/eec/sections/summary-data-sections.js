module.exports = {
  'corrected-details': {
    steps: [
      {
        step: '/problem',
        field: 'detail-full-name'
      },
      {
        step: '/problem',
        field: 'detail-sponsor-ref'
      },
      {
        step: '/problem',
        field: 'detail-photo'
      },
      {
        step: '/problem',
        field: 'detail-nin'
      },
      {
        step: '/problem',
        field: 'detail-restrictions'
      },
      {
        step: '/problem',
        field: 'detail-status'
      },
      {
        step: '/problem',
        field: 'detail-valid-until'
      }
    ]
  },
  'personal-details': {
    steps: [
      {
        step: '/personal-details',
        field: 'requestor-full-name'
      },
      {
        step: '/personal-details',
        field: 'requestor-dob'
      },
      {
        step: '/personal-details',
        field: 'requestor-nationality'
      },
      {
        step: '/personal-details',
        field: 'reference-number',
        parse: (req) => {
          return req.sessionModel.get('requestor-contact-method') === 'email' ?
            req.sessionModel.get('requestor-email') :
            Array(
              req.sessionModel.get('requestor-address-line-1'),
              req.sessionModel.get('requestor-address-line-2') ?? '',
              req.sessionModel.get('requestor-town-or-city'),
              req.sessionModel.get('requestor-county') ?? '',
              req.sessionModel.get('requestor-postcode'),
            ).join('\n');
        }
      },
      {
        step: '/contact',
        field: 'contact-details'
      }
    ]

  }
}
