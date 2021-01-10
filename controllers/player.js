const PlayerStatus = require("./playerStatus");

class Player {
  constructor(name, socket, playerStatus = PlayerStatus.acceptingChallanges) {
    this.name = name;
    this.socket = socket;
    this.playerStatus = playerStatus;
  }
}

module.exports = Player;
