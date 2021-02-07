const PlayerStatus = require('./playerStatus');

class Player {
  constructor(name, socket, status = PlayerStatus.waiting) {
    this.name = name;
    this.socket = socket;
    this.status = status;
    this.isFirstPlayer = false;
  }
}

module.exports = Player;
