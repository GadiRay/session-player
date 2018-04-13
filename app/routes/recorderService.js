function RecorderService(io, sessionRepo){
    var nsp = io.of('/recorder-ns');
    nsp.on('connection', function (socket) {
        console.log('connected recorder-ns server');
  
        socket.on('startSession', function(msg){
          console.log('got startSession' + msg.width + ' ' + msg.height);
          var id = sessionRepo.createSession(msg.startTime, msg.height,  msg.width)
                                .then(res => socket.emit('sessionCreated', { id: res}))
                                .catch(err => console.log(err));
        });
        socket.on('mouseEvents', function(msg){
          console.log('mouseEvents');
          console.log(msg.events);
          sessionRepo.updateEvents(msg.sessionId, msg.events)
                        .then(res => {
                          msg.events.sort((a, b) => a.time > b.time);
                          var endTime = msg.events[msg.events.length - 1].time;
                          sessionRepo.updateSession(msg.sessionId, endTime)
                                        .catch(e => console.log(e));

                        })
                        .catch(err => console.log(err));
        });
        
      });
};

module.exports = RecorderService;
