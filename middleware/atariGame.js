const State = require("../atari/squareState");
const Board = require("../atari/board");
const checkState = require("../atari/checkState.js");
const GameState = require("../atari/gameState");
const uuidv = require("uuid");
const drawFirst = require("../utils/drawFirstPlayer.js");

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
  }

  setPlayerToTurn(playerName) {
    this.playerToTurn = playerName;
  }

  getFirstPlayerName() {
    return this.firstPlayer.name;
  }

  setBoard(row, col, state) {
    this.board.squares[row][col].squareState = state;
    this.determineWinner();
    this.firstPlayer.socket.emit("boardChanged", state);
    this.secondPlayer.socket.emit("boardChanged", state);
    this.moveCount++;
    this.playerToTurn =
      this.moveCount % 2 === 0 ? this.firstPlayer.name : this.secondPlayer.name;
  }

  determineWinner() {
    this.board.squares.forEach(s => {
      s.forEach(sq => {
        if (checkState(this.board, sq) === false) {
          if (sq.squareState === State.black) {
            this.gameState = GameState.secondWon;
            return;
          }
          if (sq.squareState === State.white) {
            this.gameState = GameState.firstWon;
            return;
          }
        }
      });
    });
  }
}

module.exports = Game;
