///////// Modules used ///////////////
const express = require("express");
const http = require("http");
const websocket = require("ws");

const port = process.argv[2];
const app = express();
const statistics = require("./gameInfo.js");

const server = http.createServer(app);
const wss = new websocket.Server({ server });
const websockets = new Set();

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
        console.log("[LOG] " + message);
        console.log(websockets);

        if(message == "OPEN"){
            statistics.playersOnline++;
            websockets.add(ws);
            console.log("Players online are: " + statistics.playersOnline);
            websockets.forEach(function(websocket){
                websocket.send("PLAYERS_ONLINE " + statistics.playersOnline);
            })
        }

    });

    ws.addEventListener('close', (event) => {
        statistics.playersOnline--;
        console.log("Players online are: " + statistics.playersOnline);
        websockets.delete(ws);
        websockets.forEach(function(websocket){
            websocket.send("PLAYERS_ONLINE " + statistics.playersOnline);
        })
    });

});

app.use(express.static(__dirname + "/public"));
server.listen(port);