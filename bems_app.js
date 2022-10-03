var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var setHdr = require('./middleware/setHdr.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var strRouter   = require('./routes/str');
var auxRouter   = require('./routes/aux');
var envRouter   = require('./routes/env');
var simRouter   = require('./routes/sim');
var chgRouter   = require('./routes/chg');
var xhrRouter   = require('./routes/xhr');
var sysRouter   = require('./routes/sys');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('tiny'));
//app.use(logger(':method :status :res[content-length] - :response-time ms'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));

/* app.use('/str/:str', (req,res,next) => {
  res.locals.params = req.params;
  console.log("middle")
  next();
} )
 */

// Set the header for all pages
app.use(setHdr)

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/str', strRouter);
app.use('/aux', auxRouter);
app.use('/env', envRouter);
app.use('/sim', simRouter);
app.use('/sys', sysRouter);
app.use('/chg', chgRouter);
app.use('/xhr', xhrRouter);

//console.dir(xhrRouter, { depth: null })

if (app.get('env') === 'development') {
  console.log("In DEV")
  app.locals.pretty = true;
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',err);
});

module.exports = app;
