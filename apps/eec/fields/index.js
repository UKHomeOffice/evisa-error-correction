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
    },
    useHintText: false
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
  }
};
