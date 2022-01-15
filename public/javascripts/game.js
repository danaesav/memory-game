var popUp = document.getElementById('popUp');
var quitBtn = document.getElementById('quitBtn');
var noBtn = document.getElementById('noBtn');
var okBtn = document.getElementById('okBtn');
var toDim = document.querySelectorAll(".dim");
var yourScore = document.getElementById("yourScore");
var timer = document.querySelector("header");
var front = document.querySelectorAll(".front");
var fronts = document.getElementsByClassName("card");
var rears = document.querySelectorAll(".rear");
var cards = document.querySelectorAll(".card");
var finPopUpText = document.getElementById("popUpText2");
var finPopUp = document.getElementById("finPopUp");
var images_names = ["architecture.jpg", "aula.jpg", "church.jpg", "EEMCS.jpg", "library.jpg", "castle.jpg", "station.jpg", "vermeer.jpg", "pottery.jpg", "sunset.jpg"];
var yesBtn = document.getElementById('yesBtn');
var againBtn = document.getElementById('againBtn');
var displayOpponentScore = document.getElementById("opponentScore");

let score = 0;
let seconds = 0;
let done = false;
let disable = false;
let quit = false;

const socket = new WebSocket("ws://localhost:3000/play");

document.getElementById("againBtn").addEventListener("click", sendAgain);
// document.getElementById("yesBtn").addEventListener("click", quited);

function sendAgain() {
    disable = true;
    socket.send(JSON.stringify({
        from: "gameScreen",
        status: "again"
    }));
}

function quited() {
    disable = true;
    socket.send(JSON.stringify({
        from: "gameScreen",
        status: "quit"
    }));
}

socket.onopen = function () {
    socket.send(JSON.stringify({
        from: "gameScreen",
        status: "joined"
    }));
};

window.onbeforeunload = function () {
    if(!disable){
        socket.send(JSON.stringify({
            from: "gameScreen",
            status: "left"
        }));
    }
};

socket.onmessage = function(event){
    message = event.data;
    message = JSON.parse(message);
    if(message.purpose == "queued"){
        console.log("Waiting for players...");
        openWaitingPopUp();
    }else if(message.purpose == "start"){
        console.log("You may start");
        closeWaitingPopUp();
        startTimer();
    }else if(message.purpose == "updateScores"){
        console.log("Score must be updated :(");
        displayOpponentScore.textContent = "Opponent score: " + message.opScore * 10+ "%";
    } else if(message.purpose == "victory"){
        console.log("You won!");
        finPopUpText.textContent = "won because opponent left!";
        disable = true;
        activateFinish();
    } else if(message.purpose == "loss"){
        console.log("You lost!");
        finPopUpText.textContent = "lost! Opponent finished first.";
        activateFinish();
    }
   
}
