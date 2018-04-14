var socket = io('/recorder-ns');

const INTERVAL_MS = 100;

var width = screen.width;

var height = screen.height;
var sessionId;

socket.on('connect', function(){
    var startTime = new Date();
    socket.emit('startSession', { startTime: startTime.getTime(), width: width, height: height});
});
socket.on('sessionCreated', function(msg){
    console.log('got sessionId' + msg.id);
    sessionId = msg.id;
});



let handleMousemove = (event) => {
    var d = new Date();
    let mousemove = { 'time': d.getTime(), 'x': event.x, 'y': event.y };
    pushNewEvent(mousemove);
  };

  let handleMouseclick = (event) => {
    var d = new Date();
    let mouseclick = { 'time': d.getTime(), 'x': event.x, 'y': event.y, 'click': true };
    pushNewEvent(mouseclick);
  };

  let pushNewEvent = (event) => {
        socket.emit('mouseEvent', { sessionId: sessionId, event: event});  
  }

  let throttle = (func, delay) => {
      let prev = Date.now() - delay;
    
    return (...args) => {
      let current = Date.now();
      if (current - prev >= delay) {
          prev = current;
        func.apply(null, args);
      }
    }
  };
  
  document.addEventListener('mousemove', throttle(handleMousemove, INTERVAL_MS));
  document.addEventListener('mousedown', handleMouseclick);
