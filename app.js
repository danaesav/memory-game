///////// Modules used ///////////////
const express = require("express");
const http = require("http");
const websocket = require("ws");

const port = process.argv[2];
const app = express();
const statistics = require("./statistics.js");
const game = require("./gameInfo.js");
const { playersOnline } = require("./statistics.js");

const server = http.createServer(app);
const wss = new websocket.Server({ server });
const websockets = new Set();
let pairs = []
let queue = []

////////// Routes //////////////////
app.get('/', function (req, res) {
    res.sendFile("splash.html", {root: "./public"});
})

app.get('/play', function (req, res) {
    res.sendFile("game.html", {root: "./public"});
})

///////// Websocket ////////////////////
wss.on("connection", function (ws) {

    ws.on("message", function incoming(message) {
        message = JSON.parse(message);
        console.log(message);

        // If a user just joined, update stats and queue/start a game
        if(message.status == "joined"){
            if(message.from == "gameScreen"){
                if(queue.length == 0){
                    queue.push(ws);
                    ws.send(JSON.stringify({
                        purpose: "queued"
                    }))
                }else if(queue.length == 1){
                    queue.push(ws);
                    pairs.push(queue);
                    statistics.ongoingGames++;
                    sendUpdatedStats();
                    queue.forEach(function(queuedClient){
                        queuedClient.send(JSON.stringify({
                            purpose: "start"
                        }))
                    })
                    queue = [];
                }
            }
            statistics.playersOnline++;
            websockets.add(ws);
            sendUpdatedStats();
        }
        // Decrease stats when someone leaves, inform opponent of winning if ws left
        else if(message.status == "left"){
            if(message.from == "gameScreen"){
                if(getOpponent(ws) != null){
                    getOpponent(ws).send(JSON.stringify({
                        purpose: "victory",
                        reason: "Opponent left!"
                    }))
                    statistics.ongoingGames--;
                    statistics.completedGames++;
                    sendUpdatedStats();
                }
                websockets.delete(ws);
            }
            statistics.playersOnline--;
            websockets.delete(ws);
            sendUpdatedStats();
        }
        // Find where the ws is in the pairs list and send his opponent the updated score, if new score is 10 someone won
        else if(message.status == "playing"){
            const newScore = message.newScore;
            if(newScore == 10){
                getOpponent(ws).send(JSON.stringify({
                    purpose: "loss",
                    reason: "Opponent got them all first!"
                }))
                statistics.ongoingGames--;
                statistics.completedGames++;
                sendUpdatedStats();
            } else{
                getOpponent(ws).send(JSON.stringify({
                    purpose: "updateScores",
                    opScore: message.newScore
                }))
            }
        }
        else if(message.status == "again"){
            statistics.ongoingGames++;
            statistics.completedGames--;
            websockets.delete(ws);
        } else if(message.status == "quit"){
            getOpponent(ws).send(JSON.stringify({
                purpose: "victory",
                reason: "Opponent left!"
            }))
            statistics.ongoingGames--;
            statistics.completedGames++;
            sendUpdatedStats();
            websockets.delete(ws);
            sendUpdatedStats();
        }
    });
});

// Sends updated statistics to all clients
let sendUpdatedStats = function(){
    websockets.forEach(function(websocket){
        websocket.send(JSON.stringify({
            purpose: "updateStats",
            completedGames : statistics.completedGames,
            playersOnline : statistics.playersOnline,
            ongoingGames : statistics.ongoingGames
        }))
    })
}

// Returns the opponent a specific websocket is matched up with or null websocket's not found
const getOpponent = function(ws){
    for(let i=0; i<pairs.length; i++){
        if(pairs[i][0] == ws){
            return pairs[i][1];
        }else if(pairs[i][1]){
            return pairs[i][0];
        }
    }
    return null;
}


app.use(express.static(__dirname + "/public"));
server.listen(port);