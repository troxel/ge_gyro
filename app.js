var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var setHdr = require('./middleware/setHdr.js');

var idxRouter = require('./routes/index')
var ctlRouter = require('./routes/control')
var logRouter = require('./routes/log')
var dataRouter = require('./routes/data')

var app = express();

app.db = 'test'

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))
app.use(express.static(__dirname + '/node_modules/bootstrap-select/dist'))
app.use(express.static(__dirname + '/node_modules/jquery/dist'))
app.use(express.static(__dirname + '/node_modules/plotly.js-dist-min'))
app.use(express.static(__dirname + '/data-xhr-hdlr'))

// Set the header for all pages
//app.use(setHdr)

// Routes
app.use('/', idxRouter);
app.use('/control', ctlRouter);
app.use('/log', logRouter);
app.use('/data', dataRouter);

// custom settings... 
app.locals.pretty = true;

console.log(app.get('env'));
if (app.get('env') === 'development') { console.log("In DEV"); } 
else { console.log("In Production"); }

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
  res.render('error');
});

module.exports = app;
