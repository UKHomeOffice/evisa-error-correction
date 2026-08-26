const countries = require('hof').utils.countries();

module.exports = selectField => superclass => class extends superclass {
  validateField(key, req) {
    if (key === selectField) {
      const autoFieldValue = req.body[`${selectField}-auto`] ?? undefined;
      if (autoFieldValue === undefined) {
        return super.validateField(key, req);
      }

      const autoFieldIsInvalid = !countries.some(country => country.value === autoFieldValue);

      if (autoFieldIsInvalid) {
        // Order of this check is important to trigger invalidOption error when an invalid option is entered,
        // and required error when the field is cleared
        if (autoFieldValue !== '') {
          return new this.ValidationError(key, {
            type: 'invalidOption',
            redirect: undefined
          });
        }

        return new this.ValidationError(key, {
          type: 'required',
          redirect: undefined
        });
      }
    }
    return super.validateField(key, req);
  }
};
