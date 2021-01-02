const State = require("../atari/squareState");
const Board = require("../atari/board");
const checkState = require("../atari/checkState.js");
const GameState = require("../atari/gameState");

class Game {
  constructor(firstPlayer, secondPlayer) {
    this.firstPlayer = firstPlayer;
    this.secondPlayer = secondPlayer;
    this.board = new Board(8);
    this.gameState = GameState.ongoing;
  }

  setBoard(row, col, state) {
    this.board.squares[row][col].squareState = state;
    this.determineWinner();
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
