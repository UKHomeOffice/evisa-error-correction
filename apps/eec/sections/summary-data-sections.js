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
        step: '/your-correct-name',
        field: 'correct-given-names',
        parse: (val, req) => {
          if (!req.sessionModel.get('steps').includes('/your-correct-name')) {
            return null;
          }
          return `${req.sessionModel.get('correct-given-names')} ${req.sessionModel.get('correct-last-name')}`;
        }
      },
      {
        step: '/correct-date-of-birth',
        field: 'correct-date-of-birth',
        parse: val => !val ? '' : formatDate(val)
      },
      {
        step: '/correct-nationality',
        field: 'correct-nationality'
      },
      {
        step: '/problem-immigration-status',
        field: 'problem-immigration-status'
      },
      {
        step: '/date-valid-from',
        field: 'correct-visa-start-date',
        parse: val => !val ? '' : formatDate(val)
      },
      {
        step: '/date-valid-to',
        field: 'correct-visa-end-date',
        parse: val => !val ? '' : formatDate(val)
      },
      {
        step: '/national-insurance-number',
        field: 'correct-national-insurance-number'
      },
      {
        step: '/sponsor-licence-number',
        field: 'correct-sponsor-licence-number'
      },
      {
        step: '/photo',
        field: 'photo'
      },
      {
        step: '/future-partner-name',
        field: 'future-partner-correct-given-names',
        parse: (val, req) => {
          if (!req.sessionModel.get('steps').includes('/future-partner-name')) {
            return null;
          }
          const givenNames = req.sessionModel.get('future-partner-correct-given-names');
          const lastName = req.sessionModel.get('future-partner-correct-last-name');
          return `${givenNames} ${lastName}`;
        }
      },
      {
        step: '/how-many-adults',
        field: 'how-many-adults'
      },
      {
        step: '/correct-ship-and-port',
        field: 'correct-ship-name',
        parse: (val, req) => {
          if (!req.sessionModel.get('steps').includes('/correct-ship-and-port')) {
            return null;
          }
          const shipName = req.sessionModel.get('correct-ship-name');
          const portName = req.sessionModel.get('correct-port-name');
          return `${shipName}, ${portName}`;
        }
      },
      {
        step: '/correct-details-adult-accompanying',
        field: 'correct-given-names-adult-accompanying',
        parse: (val, req) => {
          if (!req.sessionModel.get('steps').includes('/correct-details-adult-accompanying')) {
            return null;
          }
          const givenNames = req.sessionModel.get('correct-given-names-adult-accompanying');
          const lastName = req.sessionModel.get('correct-last-name-adult-accompanying');
          const passportNumber = req.sessionModel.get('correct-passport-number-adult-accompanying');
          return `${givenNames} ${lastName}\n${passportNumber}`;
        }
      },
      {
        step: '/correct-flight-number-airport',
        field: 'correct-flight-number',
        parse: (val, req) => {
          if (!req.sessionModel.get('steps').includes('/correct-flight-number-airport')) {
            return null;
          }
          const flightNumber = req.sessionModel.get('correct-flight-number');
          const airport = req.sessionModel.get('correct-airport');
          return `${flightNumber}, ${airport}`;
        }
      },
      {
        step: '/correct-passport-number',
        field: 'correct-passport-number-adult-1',
        parse: (val, req) => {
          if (!req.sessionModel.get('steps').includes('/correct-passport-number')) {
            return null;
          }
          const passportNumber1 = req.sessionModel.get('correct-passport-number-adult-1');
          const passportNumber2 = req.sessionModel.get('correct-passport-number-adult-2');
          return `Adult 1: ${passportNumber1}\nAdult 2: ${passportNumber2}`;
        }
      },
      {
        step: '/details-can-do-uk',
        field: 'detail-restrictions-in-uk'
      },
      {
        step: '/share-code',
        field: 'detail-share-code'
      },
      {
        step: '/correct-email-address',
        field: 'correct-signin-email'
      },
      {
        step: '/correct-phone-number',
        field: 'correct-signin-phone'
      },
      {
        step: '/problem-not-listed',
        field: 'problem-not-listed'
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
  'your-evisa-details': {
    steps: [
      {
        step: '/your-evisa-details',
        field: 'requestor-full-name'
      },
      {
        step: '/your-evisa-details',
        field: 'requestor-dob',
        parse: val => formatDate(val)
      },
      {
        step: '/your-evisa-details',
        field: 'requestor-nationality'
      },
      {
        step: '/your-evisa-details',
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
