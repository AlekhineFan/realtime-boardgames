const socket = io();
const playerName = localStorage.getItem('playerName');

let currentGameId;
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
    playerNames += `<li>${player}</li>`;
  });
  document.querySelector('#players-list').innerHTML = playerNames;
  document.querySelectorAll('li').forEach(li =>
    li.addEventListener('click', () => {
      startNewGame(playerName, li.innerText);
    })
  );
});

socket.on('playerStatusChanged', data => {
  const playerList = document.querySelector('#players-list').childNodes;
  playerList.forEach(li => {
    li.classList.add('blue');
  });
});

socket.on('newGameStarted', newGameData => {
  currentGameId = newGameData.gameId;
  setHeader(`new game: ${newGameData.firstPlayerName} vs. ${newGameData.secondPlayerName}`);
});

socket.on('getMoveFromServer', gameData => {
  const squareId = gameData.squareId;
  const name = gameData.name;
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
    document.querySelector('#message-container').classList.add('show');
    setMessageText('Black');
    currentGameId = null;
    setHeader('Click on a player to start a game!');
  } else if (gameState === 1) {
    document.querySelector('#message-container').classList.add('show');
    setMessageText('White');
    currentGameId = null;
    setHeader('Click on a player to start a game!');
  }
});

socket.on('illegalMove', () => {
  const board = document.querySelector('.board');
  board.classList.add('illegal');
  setTimeout(() => {
    board.classList.remove('illegal');
  }, 2000);
});

squares.forEach(square => {
  square.addEventListener('click', () => {
    socket.emit('sendMoveToServer', {
      selectedSquareId: square.id,
      gameId: currentGameId,
      player: playerName,
    });
  });
});

socket.on('disconnect', () => {
  socket.emit('playerDisconnect', playerName);
});

function startNewGame(player1, player2) {
  if (player1 === player2) return;
  axios.get(`/play/newgame/${player1}|${player2}`).catch(err => console.log(err));
}
