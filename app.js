const express = require("express");
const http = require("http");
const websocket = require("ws");

const port = process.argv[2];
const app = express();
const statistics = require("./gameInfo.js");

const server = http.createServer(app);
const wss = new websocket.Server({ server });

app.get('/', function (req, res) {
    res.sendFile("splash.html", {root: "./public"});
})

app.get('/play', function (req, res) {
    res.sendFile("game.html", {root: "./public"});
})

wss.on("connection", function (ws) {

    ws.on("message", function incoming(message) {
        console.log("[LOG] " + message);
        statistics.playersOnline++;
        console.log("Players online are: " + statistics.playersOnline++);
    });
});

app.use(express.static(__dirname + "/public"));
server.listen(port);