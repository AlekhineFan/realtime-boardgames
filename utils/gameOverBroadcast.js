const gameOverBroadcast = async (io, manager, game, gameData) => {
  await ioemit()
    .then((game.firstPlayer = {}), (game.secondPlayer = {}))
    .then(manager.removeGame(gameData.gameId))
    .catch(err => console.log(err));

  async function ioemit() {
    io.emit('setPlayerStatus', {
      playerName1: game.firstPlayer.name,
      playerName2: game.secondPlayer.name,
      isPlaying: false,
    });
  }
};

module.exports = gameOverBroadcast;
