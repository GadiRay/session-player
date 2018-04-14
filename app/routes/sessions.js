var express = require('express');


var router = express.Router();

module.exports.getAllSessions = function(sessionDomain){
    router.get('/', function(req, res, next) {
        sessionDomain.getAllSessions()
            .then(result => {

                res.render('sessionsList', result);

            });

        
    });

    return router;
}


module.exports.getSessionPlayer = function(sessionDomain){
    router.get('/:sessionId', function(req, res, next){
        sessionDomain.getSessionPlayer(req.params.sessionId)
            .then(result => {
                res.render('player', result);
            });
    });
    return router;
}
