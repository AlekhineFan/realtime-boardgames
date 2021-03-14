const Game = require('./game.js');

const GameState = require('../enums/gameState.js');
const State = require('../enums/squareState.js');
const PlayerStatus = require('../enums/playerStatus');

const checkState = require('../utils/checkState.js');

class AtariGame extends Game {
  constructor(firstPlayer, secondPlayer, moveCount = 0) {
    super(firstPlayer, secondPlayer, (moveCount = 0));
  }

  getFirstPlayerName() {
    return this.firstPlayer.name;
  }

  setPlayersStatus(status) {
    this.firstPlayer.status = status;
    this.secondPlayer.status = status;
  }

  setBoard(row, col, state) {
    if (this.board.squares[row][col].squareState !== State.empty) return;

    const lastMove = this.board.squares[row][col];
    this.board.squares[row][col].squareState = state;

    const isFull = this.isBoardFull();

    if (isFull) {
      this.gameState = GameState.draw;
      this.setPlayersStatus(PlayerStatus.waiting);
    } else {
      const { hasSurroundedBlack, hasSurroundedWhite } = this.scanBoard();

      let lastMoveColor;
      if (lastMove.squareState === 1) {
        lastMoveColor = 'black';
      } else if (lastMove.squareState === 2) {
        lastMoveColor = 'white';
      }

      if (!hasSurroundedBlack && !hasSurroundedWhite) {
        this.moveCount++;
        this.playerToTurn = this.moveCount % 2 === 0 ? this.firstPlayer.name : this.secondPlayer.name;
      }

      if (lastMoveColor === 'black') {
        if (hasSurroundedWhite) {
          this.gameState = GameState.firstWon;
          this.setPlayersStatus(PlayerStatus.waiting);
          this.sendplayerStatus(false);
          console.log('black won');
        } else if (hasSurroundedBlack && !hasSurroundedWhite) {
          this.firstPlayer.socket.emit('illegalMove', {
            row,
            col,
          });
          this.board.squares[row][col].squareState = State.empty;
          console.log('illegal move by black');
        }
      }

      if (lastMoveColor === 'white') {
        if (hasSurroundedBlack) {
          this.gameState = GameState.secondWon;
          this.setPlayersStatus(PlayerStatus.waiting);
          this.sendplayerStatus(false);
          console.log('white won');
        } else if (hasSurroundedWhite && !hasSurroundedBlack) {
          this.secondPlayer.socket.emit('illegalMove', {
            row,
            col,
          });
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
      //this.firstPlayer = {};
      //this.secondPlayer = {};
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

  sendplayerStatus() {
    return super.sendplayerStatus();
  }
}

module.exports = AtariGame;
