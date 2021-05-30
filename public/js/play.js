const socket = io();
const playerName = localStorage.getItem('playerName');
const messageContainer = document.querySelector('#message-container');
const moveSound = document.querySelector('#sound-knock');
const gameStartSound = document.querySelector('#sound-gamestart');
const gameOverSound = document.querySelector('#sound-gameover');
const illegalMoveSound = document.querySelector('#sound-illegal');

let toTurn;

document.addEventListener('DOMContentLoaded', () => {
  setHeader(`Welcome, ${playerName}`);
});

socket.on('connect', () => {
  socket.emit('playerJoined', { playerName });
});

socket.on('refreshPlayerPool', pool => {
  let playerNames = '';
  pool.forEach(player => {
    playerNames += `<li class="player-element">${player}</li>`;
  });
  document.querySelector('#players-list').innerHTML = playerNames;
  document.querySelectorAll('.player-element').forEach(pe =>
    pe.addEventListener('click', () => {
      startNewGame(playerName, pe.innerText);
    })
  );
});

socket.on('setPlayerStatus', data => {
  const playerList = document.querySelector('#players-list').childNodes;
  playerList.forEach(li => {
    if (li.innerText === data.playerName1 || li.innerText === data.playerName2) {
      if (data.isPlaying) {
        li.classList.add('blue');
      } else if (!data.isPlaying) {
        li.classList.remove('blue');
      }
    }
  });
});

socket.on('newGameStarted', newGameData => {
  gameStartSound.play();
  sessionStorage.setItem('gameId', newGameData.gameId);
  setHeader(`new game: ${newGameData.firstPlayerName} vs. ${newGameData.secondPlayerName}`);
});

socket.on('getMoveFromServer', gameData => {
  const squareId = gameData.squareId;
  const squareState = gameData.squareState;

  for (const square of squares) {
    if (square.id === squareId) {
      let color;
      if (squareState === 1) {
        color = 'black';
      }
      if (squareState === 2) {
        color = 'white';
      }
      if (squareState === 0) {
        continue;
      }
      createStone(square, color);
    }
  }

  let gameState = gameData.gameState;

  if (gameState === 0) {
    gameOverSound.play();
    messageContainer.classList.add('show');
    setMessageText('Black');
    sessionStorage.setItem('gameId', '');
    setHeader('Click on a player to start a game!');
  } else if (gameState === 1) {
    gameOverSound.play();
    messageContainer.classList.add('show');
    setMessageText('White');
    sessionStorage.setItem('gameId', '');
    setHeader('Click on a player to start a game!');
  } else if (gameState === 3) {
    gameOverSound.play();
    messageContainer.classList.add('show');
    setMessageText('Game drawn!');
  } else {
    moveSound.play();
  }
});

socket.on('illegalMove', coordinates => {
  illegalId = coordinates.row.toString() + coordinates.col.toString();
  squares.forEach(sq => {
    if (sq.id === illegalId) {
      illegalMoveSound.play();
      displayError(sq);
    }
  });
});

squares.forEach(square => {
  square.addEventListener('click', () => {
    socket.emit('sendMoveToServer', {
      selectedSquareId: square.id,
      gameId: sessionStorage.getItem('gameId'),
      player: playerName,
    });
  });
});

socket.on('disconnect', () => {
  socket.emit('playerDisconnect', playerName);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  socket.emit('playerDisconnect', playerName);
  e.returnValue = '';
});

async function startNewGame(player1, player2) {
  if (player1 === player2) return;
  await axios.get(`/play/newgame/${player1}|${player2}`).catch(err => console.log(err));
}
