var express = require('express');
var pg = require('pg');

var SessionRepositoryCtor = require('../public/javascripts/sessionRepository');
var SessionRepository = new SessionRepositoryCtor(pg);

var router = express.Router();

router.get('/', function(req, res, next) {
    SessionRepository.getAllSessions()
        .then(results => {

            res.render('sessionsList', {
                sessions: results
            });

        })
});


module.exports = router;