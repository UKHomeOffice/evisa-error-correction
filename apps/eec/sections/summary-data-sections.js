const { getLabel, formatDate, truncate } = require('../../../utils');

function isTravelToUKNotBooked(req) {
  return req.sessionModel.get('booked-travel') === 'no';
}

function isInUK(req) {
  return req.sessionModel.get('in-uk') === 'yes';
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
      },
      {
        step: '/trying-to-do',
        field: 'trying-to-do'
      },
      {
        step: '/more-details',
        field: 'describe-evisa-error',
        parse: val => truncate(val, 500)
      }
    ]
  },
  'corrected-details': {
    steps: [
      {
        step: '/problem',
        field: 'detail-full-name'
      },
      {
        step: '/problem',
        field: 'detail-dob',
        parse: val => !val ? '' : formatDate(val)
      },
      {
        step: '/problem',
        field: 'detail-nationality'
      },
      {
        step: '/problem',
        field: 'detail-status'
      },
      {
        step: '/problem',
        field: 'detail-valid-from'
      },
      {
        step: '/problem',
        field: 'detail-valid-until'
      },
      {
        step: '/problem',
        field: 'detail-nin'
      },
      {
        step: '/problem',
        field: 'detail-photo'
      },
      {
        step: '/problem',
        field: 'detail-restrictions'
      },
      {
        step: '/problem',
        field: 'detail-share-code'
      },
      {
        step: '/problem',
        field: 'detail-signin-email'
      },
      {
        step: '/problem',
        field: 'detail-signin-phone'
      },
      {
        step: '/problem',
        field: 'detail-other'
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
        step: '/travel-document-details',
        field: 'travel-doc-number'
      },
      {
        step: '/travel-document-details',
        field: 'travel-doc-nationality'
      },
      {
        step: '/travel-document-details',
        field: 'travel-doc-dob',
        parse: (val, req) => isInUK(req) || !val ? '' : formatDate(val)
      },
      {
        step: '/premium',
        field: 'premium'
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
