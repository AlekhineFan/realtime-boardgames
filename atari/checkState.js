const State = require("./squareState");

const checkState = (board, square) => {
  const group = [];

  const getNeighbours = () => {
    const neighbours = [];
    let row = square.rowCoordinate;
    let col = square.colCoordinate;
    let maxVal = board.squares.length;

    if (row + 1 < maxVal) {
      neighbours.push(board.squares[row + 1][col]);
    }
    if (col + 1 < maxVal) {
      neighbours.push(board.squares[row][col + 1]);
    }
    if (row - 1 >= 0) {
      neighbours.push(board.squares[row - 1][col]);
    }
    if (col - 1 >= 0) {
      neighbours.push(board.squares[row][col - 1]);
    }

    return neighbours;
  };

  const getAllConnected = () => {
    square.checked = true;
    if (!group.includes(square)) {
      group.push(square);
    }
    const sameNeighbours = getNeighbours(board, square).filter(
      n => n.squareState === square.squareState && n.checked === false
    );

    if (sameNeighbours.length > 0) {
      sameNeighbours.forEach(n => {
        if (!group.includes(n)) {
          group.push(n);
        }
      });
      sameNeighbours.forEach(n => {
        getAllConnected(board, n);
      });
    }
  };

  const isGroupLive = () => {
    getAllConnected();
    const values = [];
    group.forEach(n => {
      values.push(
        getNeighbours(board, n).some(n => n.squareState === State.empty)
      );
    });
    return values.includes(true);
  };

  isGroupLive();
};

module.exports = checkState;
