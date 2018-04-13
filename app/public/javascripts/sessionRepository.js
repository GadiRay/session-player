

var client;
function SessionRepository(pg){

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
            'CREATE TABLE IF NOT EXISTS sessions (session_id SERIAL PRIMARY KEY,start_time bigint ,end_time bigint ,height integer,width integer)');

        const query2 = client.query(
            'CREATE TABLE IF NOT EXISTS events (session_id integer not null references sessions(session_id),cord_x integer, cord_y integer, event_time bigint, event_type varchar(16) not null default \'move\')');
    
        // client.end(function (err) {
        //     if (err) throw err;
        //   });
         });

}

SessionRepository.prototype.createSession = function createSession(startTime,height, width) {
    return new Promise((resolve, reject) =>{

        var query = `INSERT INTO sessions (session_id, start_time, end_time, height, width) VALUES (default,${startTime},${startTime},${height},${width}) RETURNING session_id;`;
    
        var res = client.query(query,
            (err, res) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(res.rows[0].session_id);
            });
    });

     
};


//TODO: move to events repository
SessionRepository.prototype.updateEvents = function updateEvents(sessionId, events) {
    return new Promise((resolve, reject) =>{
        var query = `INSERT INTO events (session_id, cord_x, cord_y, event_time, event_type) VALUES`;
        events.forEach(event => {
            var eventType = event.click ? 'click' : 'move'
            query += ` (${sessionId}, ${event.x}, ${event.y}, ${event.time}, \'${eventType}\'),`
        });
        query = query.replace(/,$/,";")
        
        client.query(
            query,
            (err, res) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });

    });
}

SessionRepository.prototype.updateSession = function updateSession(sessionId, endTime) {
    return new Promise((resolve, reject) =>{
        var sessionQuery = `UPDATE sessions SET end_time = ${endTime} WHERE session_id = ${sessionId};`
        client.query(
            sessionQuery,
            (err, res) => {
                if(err){
                    reject(err2);
                    return;
                }
                resolve(true);
            });
    });

}

SessionRepository.prototype.getAllSessions = function getAllSessions(){
    return new Promise((resolve, reject) =>{
        var sessionQuery = `Select * from sessions`
        client.query(
            sessionQuery,
            (err, res) => {
                if(err){
                    reject(err2);
                    return;
                }
                var sessions = [];
                res.rows.forEach(row => {
                    
                    var startDate = new Date((Math.round(row.start_time/1000)) * 1000);
                    var endDate = new Date((Math.round(row.end_time/1000)) * 1000);
                    var durationDate = new Date(endDate - startDate);
                    var durationTime = `${durationDate.getHours()}:${durationDate.getMinutes()}:${durationDate.getSeconds()}`;
                    sessions.push({ date: startDate.toLocaleString(), duration: durationTime, sessionId: row.session_id})
                });
                resolve(sessions);
            });
    });
}


SessionRepository.prototype.getSession = function getSession(sessionId){
    return new Promise((resolve, reject) =>{
        var query = `SELECT * FROM sessions WHERE session_id = ${sessionId}`;
        client.query(
            query,
            (err, res) => {
                if(err){
                    reject(err2);
                    return;
                }
                resolve(res.rows[0]);
            });

    });
}

SessionRepository.prototype.getEvents = function getEvents(sessionId, timestamp){
    return new Promise((resolve, reject) =>{
        var timestampWhere = timestamp == undefined ? "" : ` AND event_time > ${timestamp}`;
        var query = `SELECT * FROM events WHERE session_id = ${sessionId}${timestampWhere}`;

        client.query(
            query,
            (err, res) => {
                if(err){
                    reject(err2);
                    return;
                }
                if (res.rows.length == 0 && timestamp != undefined){
                    getEvents(sessionId, undefined)
                        .then(res =>{
                            resolve(res);
                        })
                }
                else{
                    resolve(res.rows);
                }
            });

    });
}
module.exports = SessionRepository;


