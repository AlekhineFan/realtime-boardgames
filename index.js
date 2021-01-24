const express = require("express");
const socketio = require("socket.io");
const Game = require("./middleware/atariGame");
const GameManager = require("./middleware/gameManager");
const PlayerPool = require("./controllers/playerPool");
const State = require("./atari/squareState");
const Player = require("./controllers/player");
const app = express();

const server = app.listen(3000);
const io = socketio(server);

//const playerPool = [];

const manager = new GameManager();
const pool = new PlayerPool();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/play", (req, res) => {
  res.sendFile("play.html", { root: "./public" });
});

app.get("/play/newgame/:names", (req, res) => {
  const players = req.params.names.split("|");
  const playerName1 = players[0];
  const playername2 = players[1];

  const player1 = pool.getPlayer(playerName1);
  const player2 = pool.getPlayer(playername2);

  const game = new Game(player1, player2);
  manager.addGame(game);

  player1.socket.emit("newGameStarted", game.id);
  player2.socket.emit("newGameStarted", game.id);

  console.log(`new game: ${player1.name} vs ${player2.name}`);

  res.sendStatus(204);
});

io.on("connect", socket => {
  socket.on("playerJoined", data => {
    pool.add(new Player(data.playerName, socket));
    //console.log(pool);

    io.emit("refreshPlayerPool", pool.names);
  });

  socket.on("sendMoveToServer", msg => {
    //console.log("a user has clicked");
    //console.log(msg);

    const squareId = msg.selectedSquareId;
    const row = Math.floor(squareId / 10);
    const col = squareId % 10;
    const squareState = msg.player === "first" ? State.black : State.white;
    const game = manager.getGame(msg.gameId);

    game.setBoard(row, col, squareState);
    msg.gameState = game.gameState;
    game.firstPlayer.socket.emit("getMoveFromServer", {
      squareid: squareId
    });
  });

  socket.on("playerDisconnect", playerName => {
    //playerPool.splice(playerPool.indexOf(playerName), 1);
    console.log("player disconnected");
    pool.removePlayer(playerName);
    io.emit("refreshPlayerPool", pool.names);
    console.log(pool.names);
  });
});
