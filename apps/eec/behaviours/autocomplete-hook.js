const countries = require('hof').utils.countries();

module.exports = selectField => superclass => class extends superclass {
  configure(req, res, next) {
    console.log(req.body)
    if ((req.body[`${selectField}-auto`] ?? null) !== null) {
      if (!countries.some(country => country.value === req.body[`${selectField}-auto`])) {
        req.sessionModel.set('invalid-autocomplete', {
          field: selectField,
          value: req.body[`${selectField}-auto`]
        });
      }
    }
    return super.configure(req, res, next)
  }

  validate(req, res, next) {
    const invalidAutocomplete = req.sessionModel.get('invalid-autocomplete');
    console.log('INVALID: ', invalidAutocomplete)
    req.sessionModel.unset('invalid-autocomplete');

    if (invalidAutocomplete?.field && invalidAutocomplete?.value === '') {
      return next({[invalidAutocomplete.field]: new this.ValidationError(invalidAutocomplete.field, {
        type: 'required',
        redirect: undefined
      })});
    }

    if (invalidAutocomplete?.field) {
      return next({[invalidAutocomplete.field]: new this.ValidationError(invalidAutocomplete.field, {
        type: 'invalidOption',
        redirect: undefined
      })});
    }
    return super.validate(req, res, next)
  }
}