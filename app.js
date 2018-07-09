/* eslint-disable no-unused-vars,no-param-reassign */
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const all = require('./routes/all');
const search = require('./routes/search');
const graph = require('./routes/graph');
const autocomplete = require('./routes/autocomplete');
const source = require('./routes/source');
const version = require('./routes/version');

const app = express();
const urlRootPath = process.env.URL_ROOT_PATH;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(urlRootPath, version);
app.use(urlRootPath, search);
app.use(urlRootPath, all);
app.use(urlRootPath, graph);
app.use(urlRootPath, autocomplete);
app.use(urlRootPath, source);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
