const countries = require('hof').utils.countries();


module.exports = superclass => class extends superclass {
  async configure(req, res, next) {
    console.log(req.body)
    if (req.body['autocomplete-0']) {
      if (!countries.some(country => country.value === req.body['autocomplete-0'])) {
        console.log('VERY BAD!')
      }
    }
    return super.configure(req, res, next)
  }
}