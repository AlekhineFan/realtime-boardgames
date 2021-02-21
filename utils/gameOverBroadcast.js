const gameOverBroadcast = async (io, game, gameData) => {
  await io
    .emit('setPlayerStatus', {
      playerName1: game.firstPlayer.name,
      playerName2: game.secondPlayer.name,
      isPlaying: false,
    })
    .then((game.firstPlayer = {}), (game.secondPlayer = {}))
    .then(manager.removeGame(gameData.gameId));
};

module.exports = gameOverBroadcast;
