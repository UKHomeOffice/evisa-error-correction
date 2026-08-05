'use strict';

const fs = require('fs');
const path = require('path');
const hof = require('hof');
const session = require('express-session');

let settings = require('./hof.settings');
const config = require('./config');

if (process.env.E2E_MOCK_NOTIFY === 'true') {
  const govukTemplateGeneratedPath = path.join(
    __dirname,
    'node_modules/hof/frontend/govuk-template/govuk_template_generated.html'
  );

  if (!fs.existsSync(govukTemplateGeneratedPath)) {
    require('hof/frontend/govuk-template/build')();
  }

  settings = Object.assign({}, settings, {
    sessionStore: new session.MemoryStore(),
    session: Object.assign({}, settings.session, {
      secret: process.env.SESSION_SECRET || '12345678901234567890123456789012'
    })
  });
}

settings = Object.assign({}, settings, {
  behaviours: settings.behaviours.map(require),
  routes: settings.routes.map(require)
});

const app = hof(settings);

app.use((req, res, next) => {
  res.locals.htmlLang = 'en';
  res.locals.disallowIndexing = config.disallowIndexing;
  next();
});

module.exports = app;
