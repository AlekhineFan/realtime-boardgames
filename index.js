const express = require("express");
const socketio = require("socket.io");
const Game = require("./middleware/atariGame");
const GameManager = require("./middleware/gameManager");
const State = require("./atari/squareState");
const app = express();

const server = app.listen(3000);
const io = socketio(server);

const playerPool = [];

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/play", (req, res) => {
  res.sendFile("play.html", { root: "./public" });
});

const manager = new GameManager();
const game = new Game();

io.on("connect", socket => {
  socket.on("messageToServer", msg => {
    let squareid = msg.selectedSquareId;
    let row = Math.floor(squareid / 10);
    let col = squareid % 10;

    let squareState = msg.player === "first" ? State.black : State.white;
    game.setBoard(row, col, squareState);

    msg.gameState = game.gameState;
    io.emit("messageFromServer", { msg });
  });

  socket.on("playerJoined", playerName => {
    if (!playerPool.includes(playerName)) {
      playerPool.push(playerName);
    }

    //console.log("new player has joined", playerName);
    //console.log(playerPool);

    io.emit("refreshPlayerPool", playerPool);
  });
});
