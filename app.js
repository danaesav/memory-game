///////// Modules used ///////////////
const express = require("express");
const http = require("http");
const websocket = require("ws");

const port = process.argv[2];
const app = express();
const statistics = require("./statistics.js");
const game = require("./game.js");


const server = http.createServer(app);
const wss = new websocket.Server({ server });
const websockets = new Set();       
let games = []
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
                    newGame = new game.Game(queue[0], queue[1]);
                    games.push(newGame);
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
                getGame(ws).setDone(getOpponent(ws));
            }
            statistics.playersOnline--;
            websockets.delete(ws);
            sendUpdatedStats();
        }
        // Find where the ws is in the games list and send his opponent the updated score, if new score is 10 someone won
        else if(message.status == "playing"){
            const newScore = message.newScore;
            getOpponent(ws).send(JSON.stringify({
                purpose: "updateScores",
                opScore: message.newScore
            }))
            if(newScore == 10){
                getOpponent(ws).send(JSON.stringify({
                    purpose: "loss",
                    reason: "Opponent got them all first!"
                }))
                statistics.ongoingGames--;
                statistics.completedGames++;
                getGame(ws).setDone(ws);
                sendUpdatedStats();
            }
        }
        // User wants to play again, is redirected to splash screen
        else if(message.status == "again"){
            statistics.playersOnline--;
            websockets.delete(ws);
        } 
        // User wants to end the game short and leave the game
        else if(message.status == "quit"){
            getOpponent(ws).send(JSON.stringify({
                purpose: "victory",
                reason: "Opponent left!"
            }))
            statistics.ongoingGames--;
            statistics.completedGames++;
            statistics.playersOnline--;
            websockets.delete(ws);
            getGame(ws).setDone(getOpponent(ws));
            sendUpdatedStats();
        }
        // game is finished, update leaderboard if needed
        else if(message.status == "gameFinished"){
            const newTime = message.time;
            if(statistics.leaderBoard.first>newTime){
                statistics.leaderBoard.third = statistics.leaderBoard.second;
                statistics.leaderBoard.second = statistics.leaderBoard.first;
                statistics.leaderBoard.first = newTime;
            } else if(statistics.leaderBoard.second>newTime){
                statistics.leaderBoard.third = statistics.leaderBoard.second;
                statistics.leaderBoard.second = newTime;
            } else if(statistics.leaderBoard.third>newTime){
                statistics.leaderBoard.third = newTime;
            }
            sendUpdatedStats();
        }
        // Cancel search for game
        else if(message.status == "cancel"){
            queue = [];
            statistics.playersOnline--;
            websockets.delete(ws);
        }
        console.log("[games] " + games.length + ", [QUEUE] " + queue.length);
    });
});

//////////// Helper functions //////////////////////////

// Sends updated statistics to all clients
let sendUpdatedStats = function(){
    websockets.forEach(function(websocket){
        websocket.send(JSON.stringify({
            purpose: "updateStats",
            completedGames : statistics.completedGames,
            playersOnline : statistics.playersOnline,
            ongoingGames : statistics.ongoingGames,
            lead1: statistics.leaderBoard.first,
            lead2: statistics.leaderBoard.second,
            lead3: statistics.leaderBoard.third
        }))
    })
}

// Returns the opponent a specific websocket is matched up with or null websocket's not found
const getOpponent = function(ws){
    for(let i=games.length-1; i>=0; i--){
        if(games[i].playerA == ws){
            return games[i].playerB;
        }else if(games[i].playerB == ws){
            return games[i].playerA;
        }
    }
    return null;
}

// Returns game a websocket is in
const getGame = function(ws){
    for(let i=games.length-1; i>=0; i--){
        if(games[i].playerA == ws || games[i].playerB == ws){
            return games[i];
        }
    }
    return null;
}

// Occasionally clean up games list (every 30s)
setInterval(function(){
    for(let i=0; i<games.length; i++){
        if(games[i].status == "DONE"){
            console.log(`Size before removing game was ${games.length}`);
            games.splice(i, 1);
            console.log("Removed a game");
            console.log(`New size of games list is ${games.length}`);
        }
    }
}, 30000);

app.use(express.static(__dirname + "/public"));
server.listen(port);