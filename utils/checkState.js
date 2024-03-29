const getNeighbours = require('./getNeighbours.js');

const State = require('../enums/squareState');

const checkState = (board, square) => {
  const group = [];

  const getAllConnected = square => {
    square.checked = true;
    if (!group.includes(square)) {
      group.push(square);
    }
    const sameNeighbours = getNeighbours(square, board).filter(n => n.squareState === square.squareState && n.checked === false);

    if (sameNeighbours.length > 0) {
      sameNeighbours.forEach(n => {
        if (!group.includes(n)) {
          group.push(n);
        }
      });
      sameNeighbours.forEach(n => {
        getAllConnected(n);
      });
    }
  };

  let live;

  const isGroupLive = () => {
    getAllConnected(square);
    const values = [];
    group.forEach(n => {
      values.push(getNeighbours(n, board).some(n => n.squareState === State.empty));
    });
    live = values.includes(true);
  };

  board.squares.forEach(sq => {
    sq.forEach(s => (s.checked = false));
  });

  isGroupLive();
  return live;
};

module.exports = checkState;
