var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);



var postgresConnect = require('./infrastructure/postgresConnection');

var sessionPostgresCtor = require('./infrastructure/sessionsPostgres');
var sessionPostgres = new sessionPostgresCtor(postgresConnect);
var sessionRepositoryCtor = require('./interfaces/sessionsRepository');
var sessionRepository = new sessionRepositoryCtor(sessionPostgres);
var sessionDomainCtor = require('./domain/session');
var sessionDomain = new sessionDomainCtor(sessionRepository);

var mouseEventPostgresCtor = require('./infrastructure/mouseEventPostgres');
var mouseEventPostgres = new mouseEventPostgresCtor(postgresConnect);
var mouseEventRepositoryCtor = require('./interfaces/mouseEventRepository');
var mouseEventRepository = new mouseEventRepositoryCtor(mouseEventPostgres);
var mouseEventDomainCtor = require('./domain/mouseEvent');
var mouseEventDomain = new mouseEventDomainCtor(mouseEventRepository);

require('./infrastructure/recorderWebSocketService')(io, sessionDomain, mouseEventDomain);
require('./infrastructure/playerWebSocketService')(io, mouseEventDomain);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index');
var recordRoutes = require('./routes/record');
var sessionsRoutes = require('./routes/sessions');


app.use('/', routes);
app.use('/record', recordRoutes);
app.use('/sessions', sessionsRoutes.getAllSessions(sessionDomain));
app.use('/sessions', sessionsRoutes.getSessionPlayer(sessionDomain));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


http.listen(3000);

module.exports = app;
