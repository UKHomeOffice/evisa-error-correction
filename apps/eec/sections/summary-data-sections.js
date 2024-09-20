const config = require('../../../config');
const { getLabel } = require('../../../utils');

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
        parse: val => {
          const date = new Date(val);
          const formatter = new Intl.DateTimeFormat(config.dateLocales, config.dateFormat);
          return formatter.format(date);
        }
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
          return refNumber ? `${refType.toUpperCase()} ${refNumber}` : getLabel('requestor-reference-type', refType);
        }
      },
      {
        step: '/contact',
        field: 'contact-details',
        parse: (val, req) => {
          return req.sessionModel.get('requestor-contact-method') === 'email' ?
            req.sessionModel.get('requestor-email') :
            Array(
              req.sessionModel.get('requestor-address-line-1'),
              req.sessionModel.get('requestor-address-line-2'),
              req.sessionModel.get('requestor-town-or-city'),
              req.sessionModel.get('requestor-county'),
              req.sessionModel.get('requestor-postcode')
            ).filter(x => x).join('\n');
        }
      },
      {
        step: '/completing-for-someone-else',
        field: 'completing-for-someone-else'
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
