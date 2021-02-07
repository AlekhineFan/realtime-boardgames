const State = require('../enums/squareState.js');

class Square {
  constructor(rowCoordinate, colCoordinate, squareState = State.empty, checked = false) {
    this.rowCoordinate = rowCoordinate;
    this.colCoordinate = colCoordinate;
    this.squareState = squareState;
    this.checked = checked;
  }
}

module.exports = Square;
