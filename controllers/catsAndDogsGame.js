const Game = require('./game.js');

const GameState = require('../enums/gameState.js');
const State = require('../enums/squareState.js');
const PlayerStatus = require('../enums/playerStatus');

class CatsAndDogsGame extends Game {
  constructor(firstPlayer, secondPlayer, moveCount = 0) {
    super(firstPlayer, secondPlayer, (moveCount = 0));
  }

  sendplayerStatus() {
    return super.sendplayerStatus();
  }
}

module.exports = CatsAndDogsGame;
