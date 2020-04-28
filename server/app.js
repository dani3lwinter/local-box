var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var config = require('./config');
var cors = require('cors');
var helmet = require('helmet')
var cron = require('node-cron');
const {destructOutdated} = require('./destructorService');
var notesRouter = require('./routes/notes');
var filesRouter = require('./routes/files');

// Connect to mongoDB
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
const connect = mongoose.connect(config.mongoUrl);
connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });


// run self destruct service every 15 minutes
cron.schedule('*/15 * * * *', () => {
  destructOutdated()
  .then((report) => {console.log(report)})
  .catch(err => {console.log(err)});
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Config Cross-origin
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps)
    if(!origin) return callback(null, true);

    if(config.corsAllowOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


app.use('/api/notes', notesRouter);
app.use('/api/files', filesRouter);

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
