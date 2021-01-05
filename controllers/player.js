const PlayerStatus = require("./playerStatus");

class Player {
  constructor(name, playerStatus = PlayerStatus.acceptingChallanges) {
    this.name = name;
    this.playerStatus = playerStatus;
  }
}

module.exports = Player;
