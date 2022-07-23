var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var strRouter   = require('./routes/str');
//var xhrRouter   = require('./routes/xhr');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
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

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/str', strRouter);
//app.use('/xhr', xhrRouter);

//console.dir(xhrRouter, { depth: null })


if (app.get('env') === 'development') {
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
