//////// HTML elements ///////////
const displayCompletedGames = document.getElementById("numberCompletedGames");
const displayPlayersOnline = document.getElementById("numberPlayersOnline");
const displayOngoingGames = document.getElementById("numberOngoingGames");
const displayLead1 = document.getElementById("L1");
const displayLead2 = document.getElementById("L2");
const displayLead3 = document.getElementById("L3");

///////// Web socket /////////////////
const socket = new WebSocket("ws://localhost:3000");

socket.onopen = function () {
    socket.send(JSON.stringify({
        from: "splashScreen",
        status: "joined"
    }));
    
};

window.onbeforeunload = function(){
    socket.send(JSON.stringify({
        from: "splashScreen",
        status: "left"
    }));
};

socket.onmessage = function(event){
    message = event.data;
    message = JSON.parse(message);
    if(message.purpose == "updateStats"){
        displayCompletedGames.textContent = message.completedGames;
        displayPlayersOnline.textContent = message.playersOnline;
        displayOngoingGames.textContent = message.ongoingGames;
        displayLead1.textContent = "Player1:\u0009" + message.lead1;
        displayLead2.textContent = "Player2:\u0009" + message.lead2;
        displayLead3.textContent = "Player3:\u0009" + message.lead3;
    }
    console.log("Stats supposed to be updated, ex [ONGOING GAMES] " + message.ongoingGames);
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