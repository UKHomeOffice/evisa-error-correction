module.exports = superclass => class extends superclass {
  successHandler(req, res, next) {
    const currentRoute = req.form.options.route;
    const action = req.params.action;

    if (currentRoute === '/refugee' && action === 'edit' && req.sessionModel.get('is-refugee') === 'yes') {
      this.emit('complete', req, res);
      return res.redirect('/asylum-support/edit');
    }

    return super.successHandler(req, res, next);
  }
};
