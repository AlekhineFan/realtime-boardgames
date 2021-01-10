const Game = require("./atariGame");
const PlayerPool = require("../controllers/playerPool");

class GameManager {
  constructor() {
    this.games = [];
    this.playerPool = new PlayerPool();
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
