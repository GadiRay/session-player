

var play = true;
var currentTimestamp;
var pendingTimeouts = [];

//this only support on player played at a time
//to support multi player i can use socket.io rooms with sessio id as room name
//did not complete is due to time
function PlayerWebSocketService(io, mouseEventsDomain){
    var nsp = io.of('/player-ns');
    nsp.on('connection', function (socket) {
        console.log('connected player-ns');
        socket.on('playSession', function(msg){

            console.log('got playSession' + msg);
            //in real world we won't load all the data in-memory
            //i tried to use pg-cursor and pg-querystream to prevent that but the results
            //in the ui were bad and i didn't have time to work to fix it
            mouseEventsDomain.getEventsFromTimestamp(msg.sessionId, msg.currentTimestamp)
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