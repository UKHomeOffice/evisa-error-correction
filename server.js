'use strict';

const hof = require('hof');
const session = require('express-session');

let settings = require('./hof.settings');
const config = require('./config');

settings = Object.assign({}, settings, {
  behaviours: settings.behaviours.map(require),
  routes: settings.routes.map(require)
});

if (config.env === 'test') {
  settings.sessionStore = new session.MemoryStore();
}

const app = hof(settings);

app.use((req, res, next) => {
  res.locals.htmlLang = 'en';
  res.locals.disallowIndexing = config.disallowIndexing;
  next();
});

module.exports = app;
