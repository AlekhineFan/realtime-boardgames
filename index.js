const express = require('express');
const socketio = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port);
const io = socketio(server);

const Game = require('./controllers/atariGame');
const GameManager = require('./controllers/gameManager');
const PlayerPool = require('./controllers/playerPool');
const Player = require('./classes/player');

const gameOverBroadcast = require('./utils/gameOverBroadcast');
const checkPlayerName = require('./utils/checkPlayerName');

const manager = new GameManager();
const pool = new PlayerPool();
const State = require('./enums/squareState');
const Status = require('./enums/playerStatus');

app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/favicon.ico', express.static('./public/images/favicon.ico'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/play/:name', (req, res) => {
  const name = req.params.name;
  const checkResult = checkPlayerName(pool, name);

  if (checkResult === true) {
    res.status(200).sendFile('play.html', { root: './public' });
  } else {
    res.status(409).send(checkResult);
  }
});

app.get('/play/newgame/:names', (req, res) => {
  const players = req.params.names.split('|');
  const playerName1 = players[0];
  const playerName2 = players[1];

  const player1 = pool.getPlayer(playerName1);
  const player2 = pool.getPlayer(playerName2);

  if (player1.status === Status.playing || player2.status === Status.playing || !player1 || !player2) return;

  const game = new Game(player1, player2);
  manager.addGame(game);

  player1.socket.emit('newGameStarted', {
    gameId: game.id,
    firstPlayerName: game.firstPlayer.name,
    secondPlayerName: game.secondPlayer.name,
  });

  player2.socket.emit('newGameStarted', {
    gameId: game.id,
    firstPlayerName: game.firstPlayer.name,
    secondPlayerName: game.secondPlayer.name,
  });

  io.emit('setPlayerStatus', {
    playerName1: game.firstPlayer.name,
    playerName2: game.secondPlayer.name,
    isPlaying: true,
  });

  console.log(`new game: ${player1.name} vs. ${player2.name}`);

  res.sendStatus(204);
});

io.on('connect', socket => {
  socket.on('playerJoined', data => {
    pool.add(new Player(data.playerName, socket));
    io.emit('refreshPlayerPool', pool.names);
    console.log(`${data.playerName} has joined to the server`);
  });

  socket.on('sendMoveToServer', gameData => {
    const squareId = gameData.selectedSquareId;
    const row = Math.floor(squareId / 10);
    const col = squareId % 10;
    const game = manager.getGame(gameData.gameId);

    if (!game || game.playerToTurn !== gameData.player || !gameData.gameId) return;

    const squareState = gameData.player === game.getFirstPlayerName() ? State.black : State.white;

    game.setBoard(row, col, squareState);

    if (game.gameState !== 2) {
      gameOverBroadcast(io, manager, game, gameData);
    }
  });

  socket.on('playerDisconnect', playerName => {
    console.log(`${playerName} disconnected`);
    pool.removePlayer(playerName);
    io.emit('refreshPlayerPool', pool.names);
  });
});
