class PlayerPool {
  constructor() {
    this.namePool = [];
    this.playersWithSockets = {};
  }

  addPlayerWithSocket(name, socket) {
    if (!this.namePool.includes(name)) {
      this.namePool.push(name);
      this.playersWithSockets[name] = socket;
    }
  }

  setPlayerStatus(player, status) {
    this.playersWithSockets[player].PlayerStatus = status;
  }

  removePlayer(playerName) {
    delete this.playersWithSockets[playerName];
    this.namePool = this.namePool.filter(pn => pn != playerName);
  }
}

module.exports = PlayerPool;
