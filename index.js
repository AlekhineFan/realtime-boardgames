const express = require("express");
const socketio = require("socket.io");
const Game = require("./middleware/atariGame");
const State = require("./atari/squareState");
const app = express();

const server = app.listen(3000);
const io = socketio(server);

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const game = new Game();

io.on("connect", socket => {
  socket.on("messageToServer", msg => {
    let squareid = msg.selectedSquareId;
    let row = Math.floor(squareid / 10);
    let col = squareid % 10;

    let player = msg.player === "first" ? State.black : State.white;
    game.setBoard(row, col, player);

    console.log(game.gameState);
    msg.gameState = game.gameState;
    io.emit("messageFromServer", { msg });
  });
});
