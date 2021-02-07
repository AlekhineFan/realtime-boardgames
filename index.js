const express = require('express');
const socketio = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port);
const io = socketio(server);

const Game = require('./middleware/atariGame');
const GameManager = require('./middleware/gameManager');
const PlayerPool = require('./controllers/playerPool');
const Player = require('./controllers/player');

const manager = new GameManager();
const pool = new PlayerPool();
const State = require('./atari/squareState');
const Status = require('./controllers/playerStatus');

app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/play', (req, res) => {
  res.sendFile('play.html', { root: './public' });
});

app.get('/play/newgame/:names', (req, res) => {
  const players = req.params.names.split('|');
  const playerName1 = players[0];
  const playername2 = players[1];

  const player1 = pool.getPlayer(playerName1);
  const player2 = pool.getPlayer(playername2);

  if (player1.status === Status.playing || player2.status === Status.playing) {
    res.send('player unavailable').sendStatus(409);
  }

  player1.status = Status.playing;
  player2.status = Status.playing;

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
      manager.removeGame(gameData.gameId);
    }
  });

  socket.on('playerDisconnect', playerName => {
    console.log(`${playerName} disconnected`);
    pool.removePlayer(playerName);
    io.emit('refreshPlayerPool', pool.names);
  });
});
