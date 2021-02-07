const uuidv = require('uuid');

const Board = require('../classes/board.js');

const GameState = require('../enums/gameState.js');
const State = require('../enums/squareState.js');

const checkState = require('../utils/checkState.js');
const drawFirst = require('../utils/drawFirstPlayer.js');

class Game {
  constructor(firstPlayer, secondPlayer, moveCount = 0) {
    this.id = uuidv.v1();
    this.board = new Board(8);
    this.gameState = GameState.ongoing;

    const players = drawFirst(firstPlayer, secondPlayer);
    this.firstPlayer = players[0];
    this.secondPlayer = players[1];

    this.firstPlayer.socket.emit('playerStatusChanged', {
      names: [this.firstPlayer.name, this.secondPlayer.name],
      status: 'playing',
    });
    this.secondPlayer.socket.emit('playerStatusChanged', {
      names: [this.firstPlayer.name, this.secondPlayer.name],
      status: 'playing',
    });

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
    const lastMove = this.board.squares[row][col];
    this.board.squares[row][col].squareState = state;

    const isFull = this.isBoardFull();

    if (isFull) {
      this.gameState = GameState.draw;
    } else {
      const { hasSurroundedBlack, hasSurroundedWhite } = this.scanBoard();

      let lastMoveColor;
      if (lastMove.squareState === 1) {
        lastMoveColor = 'black';
      } else if (lastMove.squareState === 2) {
        lastMoveColor = 'white';
      }

      if (!hasSurroundedBlack && !hasSurroundedWhite) {
        if (!hasSurroundedBlack && !hasSurroundedWhite) {
          this.moveCount++;
        }

        this.playerToTurn = this.moveCount % 2 === 0 ? this.firstPlayer.name : this.secondPlayer.name;
      }

      if (lastMoveColor === 'black') {
        if (hasSurroundedWhite) {
          this.gameState = GameState.firstWon;
          console.log('black won');
        } else if (hasSurroundedBlack && !hasSurroundedWhite) {
          this.firstPlayer.socket.emit('illegalMove');
          this.board.squares[row][col].squareState = State.empty;
          console.log('illegal move by black');
        }
      }

      if (lastMoveColor === 'white') {
        if (hasSurroundedBlack) {
          this.gameState = GameState.secondWon;
          console.log('white won');
        } else if (hasSurroundedWhite && !hasSurroundedBlack) {
          this.secondPlayer.socket.emit('illegalMove');
          this.board.squares[row][col].squareState = State.empty;
          console.log('illegal move by white');
        }
      }
    }

    const stateAfterCheck = this.board.squares[row][col].squareState;
    const id = row.toString() + col.toString();

    this.firstPlayer.socket.emit('getMoveFromServer', {
      squareId: id,
      name: this.playerToTurn,
      squareState: stateAfterCheck,
      gameState: this.gameState,
    });

    this.secondPlayer.socket.emit('getMoveFromServer', {
      squareId: id,
      name: this.playerToTurn,
      squareState: stateAfterCheck,
      gameState: this.gameState,
    });

    if (this.gameState !== 2) {
      this.firstPlayer = {};
      this.secondPlayer = {};
    }
  }

  scanBoard() {
    let hasSurroundedBlack = false;
    let hasSurroundedWhite = false;

    this.board.squares.forEach(s => {
      s.forEach(sq => {
        if (checkState(this.board, sq) === false) {
          if (sq.squareState === State.black) {
            hasSurroundedBlack = true;
          }
          if (sq.squareState === State.white) {
            hasSurroundedWhite = true;
          }
        }
      });
    });
    return { hasSurroundedBlack, hasSurroundedWhite };
  }

  isBoardFull() {
    return this.board.squares.every(squareArray => squareArray.every(square => square.squareState === 0));
  }
}

module.exports = Game;
