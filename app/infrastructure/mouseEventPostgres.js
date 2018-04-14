

function MouseEventPostgres(postgersConnection){
    postgersConnection.postgresConnect();
    this.client = postgersConnection.getPostgresClient();
}

MouseEventPostgres.prototype.getEvents = function getEvents(sessionId, timestamp){
    return new Promise((resolve, reject) =>{
        var timestampWhere = timestamp == undefined ? "" : ` AND eventTime > ${timestamp}`;
        var query = `SELECT * FROM events WHERE sessionId = ${sessionId}${timestampWhere}`;
        console.log('get events query '+ query);
        this.client.query(
            query,
            (err, res) => {
                if(err){
                    reject(err);
                    return;
                }
                // if (res.rows.length == 0 && timestamp != undefined){
                //     console.log('get event again');
                //     getEvents(sessionId, undefined)
                //         .then(res2 =>{
                //             resolve(res2);
                //         })
                //         .catch(err2 => {
                //             reject(err2);
                //         })
                // }
                else{
                    resolve(res.rows);
                }
            });

    });
}

MouseEventPostgres.prototype.saveEvents = function saveEvents(sessionId, events){
    return new Promise((resolve, reject) =>{
        var query = `INSERT INTO events (sessionId, cordX, cordY, eventTime, eventType) VALUES`;
        for(let event of events){
            console.log('event '+ event);
            query += ` (${sessionId}, ${event.cordX}, ${event.cordY}, ${event.eventTime}, \'${event.eventType}\'),`;
        }
        query = query.replace(/,$/,";")
        
        this.client.query(
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

module.exports = MouseEventPostgres;
