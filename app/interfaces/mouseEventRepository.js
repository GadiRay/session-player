
function MouseEventRepository(mouseEventDb){
    this.mouseEventDb = mouseEventDb;
}

MouseEventRepository.prototype.getEvents = function getEvents(sessionId, timestamp){
    return this.mouseEventDb.getEvents(sessionId, timestamp);
}

MouseEventRepository.prototype.saveEvents = function saveEvents(sessionId, events){
    return this.mouseEventDb.saveEvents(sessionId, events);
}

module.exports = MouseEventRepository;