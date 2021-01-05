class PlayerPool {
  constructor() {
    this.playerPool = [];
  }

  addPlayer(player) {
    if (!this.playerPool.includes(player)) {
      this.PlayerPool.push(player);
    } else {
      return "exists";
    }
  }

  setPlayerStatus(player, status) {
    this.playerPool.find(player).PlayerStatus = status;
  }

  removePlayer(player) {
    this.playerPool = this.playerPool.filter(p => p != player);
  }
}

module.exports = PlayerPool;
