

var pg = require('pg');
var config = require('../config');
var client;

exports.postgresConnect = function(){
    if(client){
        console.log('already connected, no need to connect again');
        return;
    }

    client = new pg.Client({
        user: config.pg.user,
        database: config.pg.database,
        password: config.pg.password,
        host: config.pg.host,
        port: config.pg.port
      });
    
      client.connect(function (err) {
        if (err) throw err;

        const query = client.query(
            'CREATE TABLE IF NOT EXISTS sessions (sessionId SERIAL PRIMARY KEY,startTime bigint ,endTime bigint ,height integer,width integer)');

        const query2 = client.query(
            'CREATE TABLE IF NOT EXISTS events (sessionId integer not null references sessions(sessionId),cordX integer, cordY integer, eventTime bigint, eventType varchar(16) not null default \'move\')');

        const indexQuery = client.query(
            'CREATE INDEX IF NOT EXISTS events_eventtime_idx on events (eventTime asc)'
        );    

    
        // client.end(function (err) {
        //     if (err) throw err;
        //   });
         });

        
}

exports.getPostgresClient = function(){
    if(client){
        return client;
    }

    console.log('no postgres client available! please connect again');

    return null;
}