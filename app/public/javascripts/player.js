var socket = io('/player-ns');
var currentTimestamp;

socket.on('connect', function(){


});

socket.on('frame', function(msg){
    console.log('got cordination ' + msg.y + ':' + msg.x);
    var image = document.getElementById('mouseImage');
    image.setAttribute('src', '/images/mouse-pointer.png');
    if(msg.click){
        image.setAttribute('src', '/images/pointer.png');
    }
    
    var d = document.getElementById('mouseCursor');
    d.style.position = "absolute";
    d.style.left =  msg.x + 58+'px';
    d.style.top = msg.y + 109+'px';
    currentTimestamp = msg.timestamp;
});

function playSession(){
    var sessionId = document.getElementById('player').getAttribute('sessionId');
    socket.emit('playSession', { sessionId: sessionId, currentTimestamp: currentTimestamp});
}

function pauseSession(){
    var sessionId = document.getElementById('player').getAttribute('sessionId');
    socket.emit('pauseSession', currentTimestamp);
}