var express = require('express');
var app = express();
var path = require('path');
var debug = require('debug')('NodeProj:server');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var cronTasks = require("./utils/cronTasks");


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/Tasker");

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
     cronTasks.start();
});
//Get Routes
var routes = require('./routes/index');

// Set handlebars as the templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Set server port
var port = 3000;
app.set('port', port);

// Disable etag headers on responses
app.disable('etag');

app.use(favicon(path.join(__dirname, '../', 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../', 'public')));

//Set routes
app.use('/', routes);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;