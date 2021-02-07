const Square = require("./square.js");

class Board {
  constructor(squaresCount) {
    this.squares = [];

    for (let i = 0; i < squaresCount; i++) {
      this.squares.push([]);
      for (let j = 0; j < squaresCount; j++) {
        this.squares[i].push(new Square(i, j));
      }
    }
  }
}

module.exports = Board;
