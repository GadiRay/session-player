

function SessionPostgres(postgersConnection){
    postgersConnection.postgresConnect();
    this.client = postgersConnection.getPostgresClient();
}


SessionPostgres.prototype.createSession = function createSession(session){
    return new Promise((resolve, reject) =>{
        
        var query = `INSERT INTO sessions (sessionId, startTime, endTime, height, width) VALUES (default,${session.startTime},${session.startTime},${session.height},${session.width}) RETURNING sessionId;`;
        
        var res = this.client.query(query,
            (err, res) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(res.rows[0].sessionid);
            });
        });
    }

SessionPostgres.prototype.updateSession = function updateSession(sessionId, endTime){
    return new Promise((resolve, reject) =>{
        var sessionQuery = `UPDATE sessions SET endTime = ${endTime} WHERE sessionId = ${sessionId};`
        this.client.query(
            sessionQuery,
            (err, res) => {
                if(err){
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });
    }

SessionPostgres.prototype.getAllSessions = function getAllSessions(){
    return new Promise((resolve, reject) =>{
        var sessionQuery = `Select * from sessions`
        this.client.query(
            sessionQuery,
            (err, res) => {
                if(err){
                    reject(err);
                    return;
                }

                resolve(res.rows);
            });
        });
    }
            
SessionPostgres.prototype.getSession = function getSession(sessionId){
    return new Promise((resolve, reject) =>{
        var query = `SELECT * FROM sessions WHERE sessionId = ${sessionId}`;
        this.client.query(
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
                
                
                
module.exports = SessionPostgres;
            