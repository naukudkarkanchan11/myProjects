var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//password encryption
var bcrypt = require('bcrypt');
//handling exception
var trycatch = require('trycatch');
var NE = require('node-exceptions');

var app = express();

class HttpException extends NE.HttpException {};

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/upstox');//mongo upstox database connection

var routes = require('./routes/index');
var users = require('./routes/users');
var addCustomer = require('./customer/addCustomer');
var getCustomerById = require('./customer/getCustomerById');
var addReferral = require('./customer/addReferral');
var fetchAllChildren = require('./customer/fetchAllChildren');
var fetchAllCustomersWithReferralCount = require('./customer/fetchAllCustomersWithReferralCount');
var addAmbassador = require('./customer/addAmbassador');
var convertCustomerToAmbassador = require('./customer/convertCustomerToAmbassador');
var fetchAllAmbassadorChildren = require('./customer/fetchAllAmbassadorChildren');
var fetchChildrenAtNthLEvel = require('./customer/fetchChildrenAtNthLEvel');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//image upload limit
app.use(bodyParser.json({
    limit: '2mb'
}));
app.use(bodyParser.urlencoded({
    limit: '2mb',
    extended: true
}));
app.use(cookieParser());
//app.use(express.static(__dirname+ '/public'));
//app.use(express.limit(100000000));
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    next();
});

//Handling cookies if not required remove it
app.get('/', function (req, res) {
    // console.log('Cookies: ', req.cookies)
    res.render('index', {});   
});

app.use('/', routes);
app.use('/users', users);
app.use('/addCustomer', addCustomer);
app.use('/getCustomerById', getCustomerById);
app.use('/addReferral', addReferral);
app.use('/fetchAllChildren', fetchAllChildren);
app.use('/fetchAllCustomersWithReferralCount', fetchAllCustomersWithReferralCount);
app.use('/addAmbassador', addAmbassador);
app.use('/convertCustomerToAmbassador', convertCustomerToAmbassador);
app.use('/fetchAllAmbassadorChildren', fetchAllAmbassadorChildren);
app.use('/fetchChildrenAtNthLEvel', fetchChildrenAtNthLEvel);


trycatch(function (err, res) {
    setTimeout(function () {
        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
            throw new NE.HttpException();
        });
    }, 1000); //setTimeout
}, function (err) {
    // console.log("Http Error : 404");
    res.status(res.statusCode).send({
        "Error": "Http Not Found"
    });
    // console.log("Http error caught!\n", err.stack);

});

// development error handler
// will print stacktrace
trycatch(function (err, res) {
        setTimeout(function () {
            if (app.get('env') === 'development') {
                app.use(function (err, req, res, next) {
                    res.status(err.status || 500);
                    res.render('error', {
                        message: err.message,
                        error: err
                    });
                    throw new NE.HttpException();
                });
            }
        }, 1000); //setTimeout
    },
    function (err) {
        // console.log("Http Error : 500");
        res.send({
            "Error": "Something bad happened "
        });
        // console.log("Http error caught!\n", err.stack);

    });


trycatch(function (err, res) {
        setTimeout(function () {
            // production error handler
            // no stacktraces leaked to user
            app.use(function (err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: {}
                });
                throw new NE.HttpException();
            });

        }, 1000); //setTimeout
    },
    function (err) {
        // console.log("Http Error1 : 500");
        res.status(res.statusCode).send({
            "Error": "Something bad happened "
        });
        //console.log("Http error caught!\n", err.stack);

    });

module.exports = app;