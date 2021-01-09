const express = require("express");
const socketio = require("socket.io");
const Game = require("./middleware/atariGame");
const GameManager = require("./middleware/gameManager");
const State = require("./atari/squareState");
const app = express();

const server = app.listen(3000);
const io = socketio(server);

const playerPool = [];

const manager = new GameManager();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/play", (req, res) => {
  res.sendFile("play.html", { root: "./public" });
});

app.get("/play/newgame/:names", (req, res) => {
  let players = req.params.names.split("|");
  let player1 = players[0];
  let player2 = players[1];

  let newGame = new Game(player1, player2);

  manager.addGame(newGame);
  console.log(`new game: ${player1} vs ${player2}`);

  res.send({ gameId: newGame.id });
});

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

    io.emit("refreshPlayerPool", playerPool);
  });

  socket.on("disconnect", playerName => {
    playerPool.splice(playerPool.indexOf(playerName), 1);
    io.emit("refreshPlayerPool", playerPool);
  });
});
