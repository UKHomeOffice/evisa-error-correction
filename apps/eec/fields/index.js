const countries = require('hof').utils.countries();
const dateComponent = require('hof').components.date;

const UANValidator = { type: 'regex', arguments: /^(\d{4}-\d{4}-\d{4}-\d{4})$/ };
const BRPValidator = { type: 'regex', arguments: /^r[a-z](\d|X)\d{6}$/gi };
const GWFValidator = { type: 'regex', arguments: /^gwf\d{9}$/gi };

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
        value: 'problem-sponsor-ref',
        toggle: 'detail-sponsor-ref',
        child: 'input-text'
      },
      {
        value: 'problem-photo',
        toggle: 'detail-photo',
        child: 'textarea'
      },
      {
        value: 'problem-nin',
        toggle: 'detail-nin',
        child: 'input-text'
      },
      {
        value: 'problem-restrictions',
        toggle: 'detail-restrictions',
        child: 'textarea'
      },
      {
        value: 'problem-status',
        toggle: 'detail-status',
        child: 'input-text'
      },
      {
        value: 'problem-valid-until',
        toggle: 'detail-valid-until',
        child: 'input-text'
      }
    ]
  },
  'detail-full-name': {
    mixin: 'input-text',
    dependent: {
      field: 'problem',
      value: 'problem-full-name'
    }
  },
  'detail-sponsor-ref': {
    mixin: 'input-text',
    dependent: {
      field: 'problem',
      value: 'problem-sponsor-ref'
    }
  },
  'detail-photo': {
    mixin: 'textarea',
    validate: [{ type: 'maxlength', arguments: 500 }],
    attributes: [{ attribute: 'rows', value: 5 }],
    dependent: {
      field: 'problem',
      value: 'problem-photo'
    }
  },
  'detail-nin': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    dependent: {
      field: 'problem',
      value: 'problem-nin'
    }
  },
  'detail-restrictions': {
    mixin: 'textarea',
    validate: [{ type: 'maxlength', arguments: 500 }],
    attributes: [{ attribute: 'rows', value: 5 }],
    dependent: {
      field: 'problem',
      value: 'problem-restrictions'
    }
  },
  'detail-status': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    dependent: {
      field: 'problem',
      value: 'problem-status'
    }
  },
  'detail-valid-until': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-one-third'],
    dependent: {
      field: 'problem',
      value: 'problem-valid-until'
    }
  },
  'reporter-full-name': {
    validate: ['required', validateText]
  },
  'reporter-dob': dateComponent('reporter-dob', {
    mixin: 'input-date',
    validate: [
      'required',
      'date',
      { type: 'before', arguments: ['0', 'days'] }
    ]
  }),
  'reporter-nationality': {
    mixin: 'select',
    className: ['typeahead'],
    validate: ['required'],
    options: [{
      value: '',
      label: 'fields.country-of-nationality.options.none_selected'
    }].concat(countries)
  },
  'reporter-reference-type': {
    mixin: 'radio-group',
    validate: 'required',
    options: [
      {
        value: 'brp',
        toggle: 'reporter-brp',
        child: 'input-text'
      },
      {
        value: 'gwf',
        toggle: 'reporter-gwf',
        child: 'input-text'
      },
      {
        value: 'uan',
        toggle: 'reporter-uan',
        child: 'input-text'
      },
      {
        value: 'passport',
        toggle: 'reporter-passport',
        child: 'input-text'
      },
      {
        value: 'no-reference'
      }
    ]
  },
  'reporter-brp': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    validate: ['required', BRPValidator],
    dependent: {
      field: 'reporter-reference-type',
      value: 'brp'
    }
  },
  'reporter-gwf': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    validate: ['required', GWFValidator],
    dependent: {
      field: 'reporter-reference-type',
      value: 'gwf'
    }
  },
  'reporter-uan': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    validate: ['required', UANValidator],
    dependent: {
      field: 'reporter-reference-type',
      value: 'uan'
    }
  },
  'reporter-passport': {
    mixin: 'input-text',
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    validate: ['required'],
    dependent: {
      field: 'reporter-reference-type',
      value: 'passport'
    }
  }
};
