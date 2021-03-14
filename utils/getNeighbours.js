const getNeighbours = (square, board) => {
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

module.exports = getNeighbours;
