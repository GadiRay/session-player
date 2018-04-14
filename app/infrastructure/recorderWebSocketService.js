
var pendingEvents = [];
var batchSize = 50;

function RecorderWebSocketService(io, sessionsDomain, mouseEventDomain){
    var nsp = io.of('/recorder-ns');
    nsp.on('connection', function (socket) {
        console.log('connected recorder-ns server');
  
        socket.on('startSession', function(msg){
          console.log('got startSession' + msg.width + ' ' + msg.height);
          var id = sessionsDomain.startSession(msg.startTime, msg.height,  msg.width)
                                .then(res => socket.emit('sessionCreated', { id: res}))
                                .catch(err => console.log(err));
        });
        socket.on('mouseEvent', function(msg){
          console.log('mouseEvents');
          console.log(msg.event);
          pendingEvents.push(msg.event);
          if(pendingEvents.length == batchSize){
              var tmpArray = pendingEvents;
              pendingEvents = [];
              mouseEventDomain.addEvents(msg.sessionId, tmpArray)
                            .then(res => {
                                tmpArray.sort((a, b) => a.time > b.time);
                              var endTime = tmpArray[tmpArray.length - 1].time;
                              sessionsDomain.endSession(msg.sessionId, endTime)
                                            .catch(e => console.log(e));
    
                            })
                            .catch(err => console.log(err));

          }
        });
        
      });
};

module.exports = RecorderWebSocketService;