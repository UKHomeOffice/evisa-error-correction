const countries = require('hof').utils.countries();

module.exports = selectField => superclass => class extends superclass {
  validate(req, res, next) {
    const autoField = req.body[`${selectField}-auto`] ?? undefined;
    const autoFieldIsInvalid = !countries.some(country => country.value === autoField)
    if (autoFieldIsInvalid) {
      if (autoField === '') {
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
    return super.validate(req, res, next)
  }
}
