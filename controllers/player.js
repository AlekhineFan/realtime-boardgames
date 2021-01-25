const PlayerStatus = require("./playerStatus");

class Player {
  constructor(name, socket, playerStatus = PlayerStatus.acceptingChallanges) {
    this.name = name;
    this.socket = socket;
    this.playerStatus = playerStatus;
    this.isFirstPlayer = false;
  }
}

module.exports = Player;
