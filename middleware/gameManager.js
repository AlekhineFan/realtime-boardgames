class GameManager {
  constructor() {
    this.games = [];
  }

  addGame(game) {
    this.games.push(game);
  }

  removeGame(game) {
    this.games = this.games.filter(g => g !== game);
  }

  getGame(game) {
    return this.games.filter(g => g === game);
  }
}

module.exports = GameManager;
