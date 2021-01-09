const Game = require("./atariGame");

class GameManager {
  constructor() {
    this.games = [];
  }

  addGame(game) {
    this.games.push(game);
  }

  removeGame(gameId) {
    this.games = this.games.filter(g => gameId !== g.id);
  }

  getGame(gameId) {
    return this.games.filter(g => gameId === g.id);
  }

  isPlaying(playerName) {
    return this.games.some(g => g.firstPlayer === playerName);
  }
}

module.exports = GameManager;
