///////// Web socket /////////////////
const socket = new WebSocket("ws://localhost:3000");

socket.onopen = function () {
    socket.send("OPEN");
    console.log("Socket opened");
};

socket.onmessage = function(event){
    message = event.data.split(" ");
    console.log(message);
    if(message[0] == "PLAYERS_ONLINE"){
        document.getElementById("numberPlayersOnline").textContent = message[1];
    }
    if(message[0] == "GAMES_STARTED"){
        document.getElementById("numberOngoingGames").textContent = message[1];
    }
}
//////////// Basic page functionality //////////////////
var x = true;
var toDim = document.querySelectorAll(".dim");

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