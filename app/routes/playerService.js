

var play = true;
var currentTimestamp;
var pendingTimeouts = [];

function PlayerService(io, sessionRepo){
    var nsp = io.of('/player-ns');
    nsp.on('connection', function (socket) {
        console.log('connected player-ns');
  
        socket.on('playSession', function(msg){
        
          console.log('got playSession' + msg);
          sessionRepo.getEvents(msg, currentTimestamp)
            .then(events =>{
                play = true;
                currentTimestamp = events[0].event_time;
                for(let event of events) {
                    var timeoutMs = event.event_time - currentTimestamp;
                    pendingTimeouts.push(setTimeout(function(){
                        
                        socket.emit('frame', { 
                                                y: event.cord_y,
                                                x: event.cord_x,
                                                timestamp: event.event_time,
                                                click: event.event_type == 'click'
                                            });
                        currentTimestamp = event.event_time;
                    }, timeoutMs));
                };

                
            });
 
        });
        socket.on('pauseSession', function(msg){
            console.log('got pause session' + msg);
            currentTimestamp = msg;
            for(let timeout of pendingTimeouts){
                clearTimeout(timeout);
            }
            play = false;
        });
      });
};

module.exports = PlayerService;
