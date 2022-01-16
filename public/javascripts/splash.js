//////// HTML elements ///////////
const displayCompletedGames = document.getElementById("numberCompletedGames");
const displayPlayersOnline = document.getElementById("numberPlayersOnline");
const displayOngoingGames = document.getElementById("numberOngoingGames");

///////// Web socket /////////////////
// const socket = new WebSocket("ws://localhost:3000");
const socket = new WebSocket("ws:www.memorygameiliasdanae.herokuapp.com");

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