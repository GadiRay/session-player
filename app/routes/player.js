var express = require('express');
var pg = require('pg');

var SessionRepositoryCtor = require('../public/javascripts/sessionRepository');
var SessionRepository = new SessionRepositoryCtor(pg);

var router = express.Router();

/* GET home page. */

router.get('/:sessionId', function(req, res, next) {
  console.log('req param ' + req.params.sessionId);
  SessionRepository.getSession(req.params.sessionId)
    .then(session => {
        res.render('player',{
            height: session.height,
            width: session.width,
            sessionId: session.session_id
        })
    });
});

module.exports = router;
