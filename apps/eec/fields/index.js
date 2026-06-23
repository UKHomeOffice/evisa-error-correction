const countries = require('hof').utils.countries();
const dateComponent = require('hof').components.date;

const UANValidator = { type: 'regex', arguments: /^(\d{4}-\d{4}-\d{4}-\d{4})$/ };
const BRPValidator = { type: 'regex', arguments: /^r[a-z](\d|X)\d{6}$/gi };
const GWFValidator = { type: 'regex', arguments: /^gwf\d{9}$/gi };
const UKVIValidator = { type: 'regex', arguments: /^KX.+$/i };
const startsWithDigitOrPlus = { type: 'regex', arguments: /^[+\d].*\d$/ };
const NIValidator = { type: 'regex', arguments: /^[A-Z]{2}[0-9]{6}[ABCD]$/ };

/**
 * Validates that the given value only includes letters (a to z), spaces, hyphens, and apostrophes.
 *
 * The validation is case-insensitive and allows:
 * - Uppercase and lowercase letters (a-z, A-Z)
 * - Spaces
 * - Hyphens (-)
 * - Apostrophes (')
 *
 * @param {string} value - The text to validate.
 * @returns {boolean} - Returns true if the value is valid, otherwise false.
 */
function validateText(value) {
  if (value?.length > 0) {
    const regex = /^[a-zA-Z\s'-]+$/;
    return regex.test(value);
  }
  return true;
}

module.exports = {
  'in-uk': {
    isPageHeading: 'true',
    mixin: 'radio-group',
    className: ['govuk-radios', 'govuk-radios--inline'],
    validate: 'required',
    options: [
      {
        value: 'yes'
      },
      {
        value: 'no'
      }
    ],
    legend: {
      className: 'govuk-!-margin-bottom-6'
    }
  },
  'booked-travel': {
    isPageHeading: 'true',
    mixin: 'radio-group',
    className: ['govuk-radios'],
    validate: ['required'],
    options: [
      {
        value: 'yes',
        toggle: 'booked-travel-date-to-uk-content',
        child: 'partials/booked-travel-date-to-uk'
      },
      {
        value: 'no'
      }
    ],
    legend: {
      className: 'govuk-!-margin-bottom-6'
    }
  },
  'booked-travel-date-to-uk': dateComponent('booked-travel-date-to-uk', {
    mixin: 'input-date',
    validate: [
      'required',
      'date'
    ],
    validationLink: {
      field: 'booked-travel',
      value: 'yes'
    }
  }),
  'travel-doc-number': {
    className: ['govuk-input', 'govuk-input--width-20'],
    validate: [
      'required',
      'alphanum',
      { type: 'minlength', arguments: 1 },
      { type: 'maxlength', arguments: 22 }
    ]
  },
  'travel-doc-nationality': {
    mixin: 'select',
    className: ['typeahead'],
    options: [{
      value: '',
      label: 'fields.travel-doc-nationality.options.none_selected'
    }].concat(countries)
  },
  'travel-doc-dob': dateComponent('travel-doc-dob', {
    mixin: 'input-date',
    validate: [
      'required',
      'date',
      { type: 'before', arguments: ['0', 'days'] },
      { type: 'after', arguments: ['120', 'years'] }
    ]
  }),
  premium: {
    isPageHeading: 'true',
    mixin: 'radio-group',
    className: ['govuk-radios', 'govuk-radios--inline'],
    validate: 'required',
    options: [
      {
        value: 'premium-priority'
      },
      {
        value: 'premium-super-priority'
      },
      {
        value: 'premium-none'
      }
    ],
    legend: {
      className: 'govuk-!-margin-bottom-6'
    }
  },
  'accessing-evisa': {
    isPageHeading: 'true',
    mixin: 'radio-group',
    className: ['govuk-radios', 'govuk-radios--inline'],
    validate: 'required',
    options: [
      {
        value: 'yes'
      },
      {
        value: 'no'
      }
    ],
    legend: {
      className: 'govuk-!-margin-bottom-6'
    }
  },
  'trying-to-do': {
    isPageHeading: 'true',
    mixin: 'radio-group',
    className: ['govuk-radios', 'govuk-radios--inline'],
    validate: 'required',
    options: [
      {
        value: 'trying-to-prove-status'
      },
      {
        value: 'trying-to-update-details'
      },
      {
        value: 'trying-to-report-error'
      }
    ],
    legend: {
      className: 'govuk-!-margin-bottom-6'
    }
  },
  problem: {
    mixin: 'checkbox-group',
    validate: ['required'],
    isPageHeading: true,
    options: [
      {
        value: 'problem-full-name'
      },
      {
        value: 'problem-date-of-birth'
      },
      {
        value: 'problem-nationality'
      },
      {
        value: 'problem-status'
      },
      {
        value: 'problem-valid-from'
      },
      {
        value: 'problem-valid-to'
      },
      {
        value: 'problem-national-insurance-number'
      },
      {
        value: 'problem-sponsor-licence-number'
      },
      {
        value: 'problem-photo'
      },
      {
        value: 'problem-future-partner-name'
      },
      {
        value: 'problem-accompanying-adult-details'
      },
      {
        value: 'problem-ship-and-port-details'
      },
      {
        value: 'problem-flight-number-airport'
      },
      {
        value: 'problem-restrictions-in-uk'
      },
      {
        value: 'problem-share-code'
      },
      {
        value: 'problem-signin-email'
      },
      {
        value: 'problem-signin-phone',
        toggle: 'detail-signin-phone',
        child: 'input-text'
      },
      {
        value: 'problem-other',
        toggle: 'detail-other',
        child: 'textarea'
      }
    ]
  },
  'correct-given-names': {
    validate: ['required', validateText, { type: 'maxlength', arguments: 120 }]
  },
  'correct-last-name': {
    validate: ['required', validateText, { type: 'maxlength', arguments: 120 }]
  },
  'correct-date-of-birth': dateComponent('correct-date-of-birth', {
    mixin: 'input-date',
    validate: [
      'required',
      'date',
      { type: 'before', arguments: ['0', 'days'] }
    ]
  }),
  'correct-nationality': {
    mixin: 'select',
    className: ['typeahead'],
    options: [{
      value: '',
      label: 'fields.correct-nationality.options.none_selected'
    }].concat(countries)
  },
  'problem-immigration-status': {
    isPageHeading: 'true',
    validate: 'required'
  },
  'correct-visa-start-date': dateComponent('correct-visa-start-date', {
    isPageHeading: 'true',
    mixin: 'input-date',
    validate: [
      'required',
      'date'
    ]
  }),
  'correct-visa-end-date': dateComponent('correct-visa-end-date', {
    isPageHeading: 'true',
    mixin: 'input-date',
    validate: [
      'required',
      'date'
    ]
  }),
  'correct-national-insurance-number': {
    formatter: ['removespaces', 'uppercase'],
    attributes: [
      { attribute: 'spellcheck', value: 'false' }
    ],
    validate: [
      'required',
      NIValidator
    ]
  },
  'correct-sponsor-licence-number': {
    validate: ['required', 'alphanum', { type: 'maxlength', arguments: 20 }],
    formatter: ['removespaces']
  },
  photo: {
    mixin: 'textarea',
    validate: ['required'],
    attributes: [{ attribute: 'rows', value: 5 }]
  },
  'future-partner-correct-given-names': {
    validate: ['required', validateText, { type: 'maxlength', arguments: 120 }]
  },
  'future-partner-correct-last-name': {
    validate: ['required', validateText, { type: 'maxlength', arguments: 120 }]
  },
  'how-many-adults': {
    isPageHeading: 'true',
    mixin: 'radio-group',
    className: ['govuk-radios'],
    validate: 'required',
    options: [
      {
        value: '1-adult'
      },
      {
        value: '2-adults'
      }
    ],
    legend: {
      className: 'govuk-!-margin-bottom-6'
    }
  },
  'correct-ship-name': {
    validate: 'required'
  },
  'correct-port-name': {
    validate: 'required'
  },
  'correct-given-names-adult-accompanying': {
    validate: ['required', validateText, { type: 'maxlength', arguments: 120 }]
  },
  'correct-last-name-adult-accompanying': {
    validate: ['required', validateText, { type: 'maxlength', arguments: 120 }]
  },
  'correct-passport-number-adult-accompanying': {
    validate: ['required', 'alphanum']
  },
  'correct-flight-number': {
    validate: 'required'
  },
  'correct-airport': {
    validate: 'required'
  },
  'correct-passport-number-adult-1': {
    validate: ['required', 'alphanum']
  },
  'correct-passport-number-adult-2': {
    validate: ['required', 'alphanum']
  },
  'detail-restrictions-in-uk': {
    isPageHeading: 'true',
    mixin: 'textarea',
    validate: ['required', { type: 'maxlength', arguments: 500 }],
    attributes: [{ attribute: 'rows', value: 5 }]
  },
  'detail-share-code': {
    isPageHeading: 'true',
    validate: ['required', { type: 'maxlength', arguments: 200 }]
  },
  'correct-signin-email': {
    isPageHeading: 'true',
    validate: [
      'required',
      'email',
      { type: 'maxlength', arguments: 254 },
      { type: 'minlength', arguments: 6 }
    ]
  },
  'detail-signin-phone': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-one-third'],
    validate: ['required', 'internationalPhoneNumber', startsWithDigitOrPlus],
    dependent: {
      field: 'problem',
      value: 'problem-signin-phone'
    }
  },
  'detail-other': {
    mixin: 'textarea',
    validate: ['required', { type: 'maxlength', arguments: 500 }],
    attributes: [{ attribute: 'rows', value: 5 }],
    dependent: {
      field: 'problem',
      value: 'problem-other'
    }
  },
  'is-refugee': {
    isPageHeading: 'true',
    mixin: 'radio-group',
    className: ['govuk-radios', 'govuk-radios--inline'],
    validate: 'required',
    options: [
      {
        value: 'yes'
      },
      {
        value: 'no'
      }
    ],
    legend: {
      className: 'govuk-!-margin-bottom-6'
    }
  },
  'asylum-support': {
    isPageHeading: 'true',
    mixin: 'radio-group',
    className: ['govuk-radios', 'govuk-radios--inline'],
    validate: 'required',
    options: [
      {
        value: 'yes'
      },
      {
        value: 'no'
      }
    ],
    legend: {
      className: 'govuk-!-margin-bottom-6'
    }
  },
  'requestor-full-name': {
    validate: ['required', validateText]
  },
  'requestor-dob': dateComponent('requestor-dob', {
    mixin: 'input-date',
    validate: [
      'required',
      'date',
      { type: 'before', arguments: ['0', 'days'] }
    ]
  }),
  'requestor-nationality': {
    mixin: 'select',
    className: ['typeahead'],
    options: [{
      value: '',
      label: 'fields.requestor-nationality.options.none_selected'
    }].concat(countries)
  },
  'requestor-reference-type': {
    mixin: 'radio-group',
    validate: 'required',
    options: [
      {
        value: 'brp',
        toggle: 'requestor-brp',
        child: 'input-text'
      },
      {
        value: 'gwf',
        toggle: 'requestor-gwf',
        child: 'input-text'
      },
      {
        value: 'uan',
        toggle: 'requestor-uan',
        child: 'input-text'
      },
      {
        value: 'passport',
        toggle: 'requestor-passport',
        child: 'input-text'
      },
      {
        value: 'ukvi',
        toggle: 'requestor-ukvi',
        child: 'input-text'
      },
      {
        value: 'no-reference'
      }
    ]
  },
  'requestor-brp': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    validate: ['required', BRPValidator],
    dependent: {
      field: 'requestor-reference-type',
      value: 'brp'
    }
  },
  'requestor-gwf': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    validate: ['required', GWFValidator],
    dependent: {
      field: 'requestor-reference-type',
      value: 'gwf'
    }
  },
  'requestor-uan': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    validate: ['required', UANValidator],
    dependent: {
      field: 'requestor-reference-type',
      value: 'uan'
    }
  },
  'requestor-passport': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    validate: ['required'],
    dependent: {
      field: 'requestor-reference-type',
      value: 'passport'
    }
  },
  'requestor-ukvi': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    validate: [
      'required',
      UKVIValidator,
      { type: 'exactlength', arguments: 10 }
    ],
    dependent: {
      field: 'requestor-reference-type',
      value: 'ukvi'
    }
  },
  'requestor-contact-method': {
    mixin: 'radio-group',
    validate: ['required'],
    options: [
      {
        value: 'email',
        toggle: 'requestor-email',
        child: 'input-text'
      },
      {
        value: 'uk-address',
        toggle: 'address-details-fieldset',
        child: 'partials/address-details'
      }
    ],
    legend: {
      className: 'govuk-!-margin-bottom-6'
    }
  },
  'requestor-email': {
    validate: [
      'required',
      'email',
      { type: 'maxlength', arguments: 254 }
    ],
    dependent: {
      field: 'requestor-contact-method',
      value: 'email'
    }
  },
  'requestor-address-line-1': {
    validate: ['required'],
    dependent: {
      field: 'requestor-contact-method',
      value: 'uk-address'
    }
  },
  'requestor-address-line-2': {
    dependent: {
      field: 'requestor-contact-method',
      value: 'uk-address'
    }
  },
  'requestor-town-or-city': {
    validate: ['required'],
    dependent: {
      field: 'requestor-contact-method',
      value: 'uk-address'
    }
  },
  'requestor-county': {
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    dependent: {
      field: 'requestor-contact-method',
      value: 'uk-address'
    }
  },
  'requestor-postcode': {
    formatter: ['ukPostcode'],
    validate: ['required', 'postcode'],
    className: ['govuk-input', 'govuk-!-width-one-third'],
    dependent: {
      field: 'requestor-contact-method',
      value: 'uk-address'
    }
  },
  'completing-for-someone-else': {
    isPageHeading: 'true',
    mixin: 'radio-group',
    className: ['govuk-radios', 'govuk-radios--inline'],
    validate: 'required',
    options: [
      {
        value: 'yes'
      },
      {
        value: 'no'
      }
    ],
    legend: {
      className: 'govuk-!-margin-bottom-6'
    }
  },
  'representative-name': {
    mixin: 'input-text',
    validate: ['required', validateText]
  },
  'representative-email': {
    mixin: 'input-text',
    validate: [
      'required',
      'email',
      { type: 'maxlength', arguments: 254 }
    ]
  },
  'representative-type': {
    mixin: 'radio-group',
    validate: 'required',
    options: [
      { value: 'sponsor' },
      { value: 'legal-representative' },
      { value: 'friend-or-relative' },
      { value: 'support-organisation' }
    ]
  },
  'describe-evisa-error': {
    mixin: 'textarea',
    validate: ['required', { type: 'maxlength', arguments: 2000 }],
    attributes: [{ attribute: 'rows', value: 5 }],
    includeInSummary: true
  }
};
