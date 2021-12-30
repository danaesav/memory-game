const express = require("express");
const http = require("http");

const port = process.argv[2];
const app = express();

app.get('/', function (req, res) {
    res.sendFile("splash.html", {root: "./public"});
})

app.get('/play', function (req, res) {
    res.sendFile("game.html", {root: "./public"});
})

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);