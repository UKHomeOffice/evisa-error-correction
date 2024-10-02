const countries = require('hof').utils.countries();

module.exports = selectField => superclass => class extends superclass {
  validate(req, res, next) {
    const autoFieldValue = req.body[`${selectField}-auto`] ?? undefined;

    if (!selectField || autoFieldValue === undefined) {
      return super.validate(req, res, next);
    }

    const autoFieldIsInvalid = !countries.some(country => country.value === autoFieldValue);

    if (autoFieldIsInvalid) {
      if (autoFieldValue === '') {
        return next({[selectField]: new this.ValidationError(selectField, {
          type: 'required',
          redirect: undefined
        })});
      }

      return next({[selectField]: new this.ValidationError(selectField, {
        type: 'invalidOption',
        redirect: undefined
      })});
    }
    return super.validate(req, res, next);
  }
};
