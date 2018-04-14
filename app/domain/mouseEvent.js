class MouseEvent{
    constructor(sessionId, x, y, timestamp, eventType){
        this.sessionId = sessionId;
        this.cordX = x;
        this.cordY = y;
        this.eventTime = timestamp;
        this.eventType = eventType;
    }
}

function MouseEventDomain(mouseEventRepo){
    this.mouseEventRepo = mouseEventRepo;
}

MouseEventDomain.prototype.getEventsFromTimestamp = function getEventsFromTimestamp(sessionId, timestamp) {
    return new Promise((resolve, reject) =>{
        this.mouseEventRepo.getEvents(sessionId, timestamp)
            .then(results =>{
                var events = [];
                for(let event of results){
                    events.push({
                        x: event.cordx,
                        y: event.cordy,
                        timestamp: event.eventtime,
                        click: event.eventtype == 'click'
                    });
                }
                resolve(events);
            })
            .catch(err =>{
                reject(err);
            })
    });
}


MouseEventDomain.prototype.addEvents = function addEvents(sessionId, events) {
    console.log('mouseEventRepo '+ this.mouseEventRepo);
    var mouseEvents = [];
    for(let event of events){
        var eventType = event.click ? 'click' : 'move';
        var mouseEvent = new MouseEvent(sessionId,event.x, event.y, event.time, eventType);
        mouseEvents.push(mouseEvent);
    }
    return this.mouseEventRepo.saveEvents(sessionId, mouseEvents);
}


module.exports = MouseEventDomain;