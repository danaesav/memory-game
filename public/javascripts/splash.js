///////// Web socket /////////////////
const socket = new WebSocket("ws://localhost:3000");

socket.onopen = function () {
    socket.send("OPEN");
    console.log("Socket oipened");
};

socket.onmessage = function(event){
    message = event.data.split(" ");
    console.log(message);
    if(message[0] == "PLAYERS_ONLINE"){
        document.getElementById("numberPlayersOnline").textContent = message[1];
    }
}
//////////// Basic page functionality //////////////////
var x = true;
var toDim = document.querySelectorAll(".dim");
function cancel() {
    x = false;
    for(e of toDim){
        e.style.opacity=1;
    }
    document.getElementById('popUp').style.display='none';
}
function play() {
    document.getElementById('popUp').style.display='block';
    for(e of toDim){
        e.style.opacity=0.5;
        document.getElementById('popUp').style.opacity=1;
    }
    setTimeout(function(){
        if(x){document.getElementById("playForm").submit()}
        x = true;
    }, 1500);
}

var e = document.getElementById('rulesButton');
e.onmouseover = function() {
    document.getElementById('popUpInfo').style.display = 'block';
}
e.onmouseout = function() {
    document.getElementById('popUpInfo').style.display = 'none';
}

var k = document.getElementById('leaderboardButton');
k.onmouseover = function() {
    document.getElementById('popUpLead').style.display = 'block';
}
k.onmouseout = function() {
    document.getElementById('popUpLead').style.display = 'none';
}