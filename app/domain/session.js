class Session{
    constructor(startTime, height, width){
        this.sessionId = '';
        this.startTime = startTime;
        this.endTime = startTime;
        this.height = height;
        this.width = width;
    }
}


function SessionDomain(sessionRepo){
    this.sessionRepo = sessionRepo;
}

SessionDomain.prototype.getAllSessions = function getAllSessions(){
    return new Promise((resolve, reject) =>{
        this.sessionRepo.getAllSessions()
        .then(sessions =>{
            var sessionList = [];
            for(let session of sessions){
                var startDate = new Date((Math.round(session.starttime/1000)) * 1000);
                var endDate = new Date((Math.round(session.endtime/1000)) * 1000);
                var durationDate = new Date(endDate - startDate);
                var durationTime = `${durationDate.getHours()}:${durationDate.getMinutes()}:${durationDate.getSeconds()}`;
                var sessionToAdd = { date: startDate.toLocaleString(), duration: durationTime, sessionId: session.sessionid};
                console.log(session);
                sessionList.push(sessionToAdd);
            }
            resolve({
                sessions: sessionList
            });
        })
        .catch(err =>{
            reject(err);
        });
    });
}

SessionDomain.prototype.getSessionPlayer = function getSessionPlayer(sessionId){
    return new Promise((resolve, reject) =>{
        this.sessionRepo.getSession(sessionId)
            .then(session =>{
                resolve({
                    height: session.height,
                    width: session.width,
                    sessionId: sessionId
                });
            })
            .catch(err =>{
                reject(err);
            });

    });
}

SessionDomain.prototype.startSession = function startSession(startTime, height, width){
    var session = new Session(startTime,height,width);
    return new Promise((resolve, reject)=>{
        this.sessionRepo.createSession(session)
            .then(result =>{
                resolve(result);
            })
            .catch(err =>{
                reject(err);
            })

    });

}

SessionDomain.prototype.endSession = function endSession(sessionId, endTime){
    return new Promise((resolve,reject) =>{
        this.sessionRepo.updateSession(sessionId, endTime)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            })
    })
}
module.exports = SessionDomain