

var pg = require('pg');
var client;

exports.postgresConnect = function(){
    if(client){
        console.log('already connected, no need to connect again');
        return;
    }

    client = new pg.Client({
        user: 'postgres', //env var: PGUSER
        database: 'postgres', //env var: PGDATABASE
        password: 'postgres', //env var: PGPASSWORD
        host: 'db', // Server hosting the postgres database
        port: 5432, //env var: PGPORT
      });
    
      client.connect(function (err) {
        if (err) throw err;

        const query = client.query(
            'CREATE TABLE IF NOT EXISTS sessions (sessionId SERIAL PRIMARY KEY,startTime bigint ,endTime bigint ,height integer,width integer)');

        const query2 = client.query(
            'CREATE TABLE IF NOT EXISTS events (sessionId integer not null references sessions(sessionId),cordX integer, cordY integer, eventTime bigint, eventType varchar(16) not null default \'move\')');
    
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