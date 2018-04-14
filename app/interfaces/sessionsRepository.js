
function SessionRepository(sessionsDb){
    this.sessionsDb = sessionsDb;
}
SessionRepository.prototype.createSession = function createSession(session){
    return this.sessionsDb.createSession(session);
}

SessionRepository.prototype.updateSession = function updateSession(sessionId, endTime){
    return this.sessionsDb.updateSession(sessionId, endTime);
}

SessionRepository.prototype.getAllSessions = function getAllSessions(){
    return this.sessionsDb.getAllSessions();
}

SessionRepository.prototype.getSession = function getSession(sessionId){
    return this.sessionsDb.getSession(sessionId);
}

module.exports = SessionRepository;