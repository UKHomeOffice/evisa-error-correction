const { getLabel, formatDate } = require('../../../utils');

function isAccessingEvisa(req) {
  return req.sessionModel.get('accessing-evisa') === 'yes';
}

function isTravelToUKNotBooked(req) {
  return req.sessionModel.get('booked-travel') === 'no';
}

module.exports = {
  'customer-type': {
    steps: [
      {
        step: '/in-uk',
        field: 'in-uk'
      },
      {
        step: '/accessing-evisa',
        field: 'accessing-evisa'
      }
    ]
  },
  'travel-details': {
    steps: [
      {
        step: '/booked-travel',
        field: 'booked-travel'
      },
      {
        step: '/booked-travel',
        field: 'booked-travel-date-to-uk',
        parse: (val, req) => isTravelToUKNotBooked(req) || !val ? '' : formatDate(val)
      },
      {
        step: '/premium',
        field: 'premium'
      }
    ]
  },
  'corrected-details': {
    steps: [
      {
        step: '/problem',
        field: 'detail-full-name',
        parse: (val, req) => isAccessingEvisa(req) ? '' : val
      },
      {
        step: '/problem',
        field: 'detail-dob',
        parse: (val, req) => isAccessingEvisa(req) || !val ? '' : formatDate(val)
      },
      {
        step: '/problem',
        field: 'detail-nationality',
        parse: (val, req) => isAccessingEvisa(req) ? '' : val
      },
      {
        step: '/problem',
        field: 'detail-status',
        parse: (val, req) => isAccessingEvisa(req) ? '' : val
      },
      {
        step: '/problem',
        field: 'detail-valid-from',
        parse: (val, req) => isAccessingEvisa(req) ? '' : val
      },
      {
        step: '/problem',
        field: 'detail-valid-until',
        parse: (val, req) => isAccessingEvisa(req) ? '' : val
      },
      {
        step: '/problem',
        field: 'detail-nin',
        parse: (val, req) => isAccessingEvisa(req) ? '' : val
      },
      {
        step: '/problem',
        field: 'detail-photo',
        parse: (val, req) => isAccessingEvisa(req) ? '' : val
      },
      {
        step: '/problem',
        field: 'detail-restrictions',
        parse: (val, req) => isAccessingEvisa(req) ? '' : val
      },
      {
        step: '/problem',
        field: 'detail-share-code',
        parse: (val, req) => isAccessingEvisa(req) ? '' : val
      },
      {
        step: '/problem',
        field: 'detail-signin-email',
        parse: (val, req) => isAccessingEvisa(req) ? '' : val
      },
      {
        step: '/problem',
        field: 'detail-signin-phone',
        parse: (val, req) => isAccessingEvisa(req) ? '' : val
      },
      {
        step: '/problem',
        field: 'detail-other',
        parse: (val, req) => isAccessingEvisa(req) ? '' : val
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

          const formattedReference = refNumber ?
            `${refType.toUpperCase()} ${refNumber}` : getLabel('requestor-reference-type', refType);
          req.sessionModel.set('formatted-reference', formattedReference);

          return formattedReference;
        }
      },
      {
        step: '/refugee',
        field: 'is-refugee'
      },
      {
        step: '/asylum-support',
        field: 'asylum-support'
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
