const drawFirst = (player1, player2) => {
  const rnd = Math.floor(Math.random() * 2);
  const players = [];
  if (rnd === 0) {
    players[0] = player1;
    players[1] = player2;
  } else {
    players[0] = player2;
    players[1] = player1;
  }
  return players;
};

module.exports = drawFirst;
