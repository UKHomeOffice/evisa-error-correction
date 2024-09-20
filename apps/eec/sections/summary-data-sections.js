const { getLabel, formatDate } = require('../../../utils');

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
        field: 'requestor-dob',
        parse: val => formatDate(val)
      },
      {
        step: '/personal-details',
        field: 'requestor-nationality'
      },
      {
        step: '/personal-details',
        field: 'reference-number',
        parse: (val, req) => {
          const refType = req.sessionModel.get('requestor-reference-type');
          const refNumber = refType !== 'no-reference' ? req.sessionModel.get(`requestor-${refType}`) : undefined;
          let formattedReference;
          if (refNumber) {
            formattedReference = `${refType.toUpperCase()} ${refNumber}`;
          } else {
            formattedReference = getLabel('requestor-reference-type', refType);
          }
          req.sessionModel.set('formatted-reference', formattedReference);
          return formattedReference;
        }
      },
      {
        step: '/contact',
        field: 'contact-details',
        parse: (val, req) => {
          if (req.sessionModel.get('requestor-contact-method') === 'email') {
            return req.sessionModel.get('requestor-email');
          }

          const formattedAddress = Array(
            req.sessionModel.get('requestor-address-line-1'),
            req.sessionModel.get('requestor-address-line-2'),
            req.sessionModel.get('requestor-town-or-city'),
            req.sessionModel.get('requestor-county'),
            req.sessionModel.get('requestor-postcode')
          ).filter(x => x).join('\n');

          req.sessionModel.set('formatted-address', formattedAddress);
          return formattedAddress;
        }
      }
    ]
  },
  'completing-for-someone-else': {
    steps: [
      {
        step: '/someone-else-details',
        field: 'representative-name',
        dependsOn: 'completing-for-someone-else'
      },
      {
        step: '/someone-else-details',
        field: 'representative-email',
        dependsOn: 'completing-for-someone-else'
      },
      {
        step: '/someone-else-details',
        field: 'representative-type',
        dependsOn: 'completing-for-someone-else'
      }
    ]
  }
};
