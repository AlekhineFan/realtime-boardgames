const PlayerStatus = require('../enums/playerStatus');

class PlayerPool {
  constructor() {
    this.playersWithSockets = {};
    this.names = [];
  }

  add(player) {
    if (!this.names.includes(player.name)) {
      this.names.push(player.name);
      this.playersWithSockets[player.name] = player;
    }
    console.log(this.names);
  }

  getPlayer(playerName) {
    const player = this.playersWithSockets[playerName];
    player.playerStatus = PlayerStatus.playing;
    return player;
  }

  setPlayerStatus(player, status) {
    this.playersWithSockets[player].PlayerStatus = status;
  }

  removePlayer(playerName) {
    delete this.playersWithSockets[playerName];
    this.names = this.names.filter(pn => pn !== playerName);
  }
}

module.exports = PlayerPool;
