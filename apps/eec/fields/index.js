const countries = require('hof').utils.countries();
const dateComponent = require('hof').components.date;

const UANValidator = { type: 'regex', arguments: /^(\d{4}-\d{4}-\d{4}-\d{4})$/ };
const BRPValidator = { type: 'regex', arguments: /^r[a-z](\d|X)\d{6}$/gi };
const GWFValidator = { type: 'regex', arguments: /^gwf\d{9}$/gi };
const UKVIValidator = { type: 'regex', arguments: /^KX.+$/i };
const startsWithDigitOrPlus = { type: 'regex', arguments: /^[+\d].*\d$/ };

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
  'viewing-evisa': {
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
  problem: {
    mixin: 'checkbox-group',
    validate: ['required'],
    isPageHeading: true,
    options: [
      {
        value: 'problem-full-name',
        toggle: 'detail-full-name',
        child: 'input-text'
      },
      {
        value: 'problem-dob',
        toggle: 'detail-dob-toggle-content',
        child: 'partials/detail-dob'
      },
      {
        value: 'problem-nationality',
        toggle: 'detail-nationality-toggle-content',
        child: 'partials/detail-nationality'
      },
      {
        value: 'problem-status',
        toggle: 'detail-status',
        child: 'input-text'
      },
      {
        value: 'problem-valid-from',
        toggle: 'detail-valid-from',
        child: 'input-text'
      },
      {
        value: 'problem-valid-until',
        toggle: 'detail-valid-until',
        child: 'input-text'
      },
      {
        value: 'problem-nin',
        toggle: 'detail-nin',
        child: 'input-text'
      },
      {
        value: 'problem-photo',
        toggle: 'detail-photo',
        child: 'textarea'
      },
      {
        value: 'problem-restrictions',
        toggle: 'detail-restrictions',
        child: 'textarea'
      },
      {
        value: 'problem-share-code',
        toggle: 'detail-share-code',
        child: 'input-text'
      },
      {
        value: 'problem-signin-email',
        toggle: 'detail-signin-email',
        child: 'input-text'
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
  'detail-full-name': {
    mixin: 'input-text',
    validate: 'required',
    dependent: {
      field: 'problem',
      value: 'problem-full-name'
    }
  },
  'detail-dob': dateComponent('detail-dob', {
    mixin: 'input-date',
    validate: [
      'required',
      'date',
      { type: 'before', arguments: ['0', 'days'] }
    ]
  }),
  'detail-nationality': {
    mixin: 'select',
    className: ['typeahead'],
    formGroupClassName: ['govuk-!-width-two-thirds'],
    validate: ['required'],
    options: countries,
    validationLink: {
      field: 'problem',
      value: 'problem-nationality'
    }
  },
  'detail-photo': {
    mixin: 'textarea',
    validate: ['required', { type: 'maxlength', arguments: 500 }],
    attributes: [{ attribute: 'rows', value: 5 }],
    dependent: {
      field: 'problem',
      value: 'problem-photo'
    }
  },
  'detail-nin': {
    mixin: 'input-text',
    validate: 'required',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    dependent: {
      field: 'problem',
      value: 'problem-nin'
    }
  },
  'detail-restrictions': {
    mixin: 'textarea',
    validate: ['required', { type: 'maxlength', arguments: 500 }],
    attributes: [{ attribute: 'rows', value: 5 }],
    dependent: {
      field: 'problem',
      value: 'problem-restrictions'
    }
  },
  'detail-share-code': {
    mixin: 'input-text',
    validate: 'required',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    dependent: {
      field: 'problem',
      value: 'problem-share-code'
    }
  },
  'detail-status': {
    mixin: 'input-text',
    validate: 'required',
    dependent: {
      field: 'problem',
      value: 'problem-status'
    }
  },
  'detail-valid-from': {
    mixin: 'input-text',
    validate: 'required',
    className: ['govuk-input', 'govuk-!-width-one-third'],
    dependent: {
      field: 'problem',
      value: 'problem-valid-from'
    }
  },
  'detail-valid-until': {
    mixin: 'input-text',
    validate: 'required',
    className: ['govuk-input', 'govuk-!-width-one-third'],
    dependent: {
      field: 'problem',
      value: 'problem-valid-until'
    }
  },
  'detail-signin-email': {
    mixin: 'input-text',
    validate: [
      'required',
      'email',
      { type: 'maxlength', arguments: 254 }
    ],
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    dependent: {
      field: 'problem',
      value: 'problem-signin-email'
    }
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
    validate: ['required'],
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
  }
};
