const Game = require("./atariGame");

class GameManager {
  constructor() {
    this.games = {};
  }

  addGame(game) {
    this.games[game.id] = game;
  }

  removeGame(gameId) {
    delete this.games[gameId];
  }

  getGame(gameId) {
    return this.games[gameId];
  }
}

module.exports = GameManager;
