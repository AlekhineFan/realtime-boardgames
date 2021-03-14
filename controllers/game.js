const uuidv = require('uuid');

const Board = require('../classes/board.js');

const GameState = require('../enums/gameState.js');
const State = require('../enums/squareState.js');
const PlayerStatus = require('../enums/playerStatus');

const drawFirst = require('../utils/drawFirstPlayer.js');

class Game {
  constructor(firstPlayer, secondPlayer, moveCount = 0) {
    this.id = uuidv.v1();
    this.board = new Board(8);
    this.gameState = GameState.ongoing;

    const players = drawFirst(firstPlayer, secondPlayer);
    this.firstPlayer = players[0];
    this.secondPlayer = players[1];

    this.playerToTurn = this.firstPlayer.name;
    this.moveCount = moveCount;

    this.setPlayersStatus(PlayerStatus.playing);
    this.sendplayerStatus(true);
  }

  setPlayersStatus(status) {
    this.firstPlayer.status = status;
    this.secondPlayer.status = status;
  }

  setBoard() {
    if (this.board.squares[row][col].squareState !== State.empty) return;
  }

  sendplayerStatus(arePlaying) {
    this.firstPlayer.socket.emit('setPlayerStatus', {
      playerName1: this.firstPlayer.name,
      playerName2: this.secondPlayer.name,
      isPlaying: arePlaying,
    });
    this.secondPlayer.socket.emit('setPlayerStatus', {
      playerName1: this.firstPlayer.name,
      playerName2: this.secondPlayer.name,
      isPlaying: arePlaying,
    });
  }
}

module.exports = Game;
