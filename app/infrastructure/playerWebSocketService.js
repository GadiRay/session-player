

var play = true;
var currentTimestamp;
var pendingTimeouts = [];


function PlayerWebSocketService(io, mouseEventsDomain){
    var nsp = io.of('/player-ns');
    nsp.on('connection', function (socket) {
        console.log('connected player-ns');
        socket.on('playSession', function(msg){
        
            console.log('got playSession' + msg);
            mouseEventsDomain.getEventsFromTimestamp(msg, currentTimestamp)
              .then(events =>{
                  play = true;
                  if(events.length > 0){
                      currentTimestamp = events[0].timestamp;
                      for(let event of events) {
                          var timeoutMs = event.timestamp - currentTimestamp;
                          pendingTimeouts.push(setTimeout(function(){
                              socket.emit('frame', event);
                              currentTimestamp = event.timestamp;
                          }, timeoutMs));
                      };
                  }
    
                  
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

}

module.exports = PlayerWebSocketService;