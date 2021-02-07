const socket = io();
const playerName = localStorage.getItem('playerName');
const messageContainer = document.querySelector('#message-container');

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

socket.on('setPlayerStatus', data => {
  const playerList = document.querySelector('#players-list').childNodes;
  console.log(data);
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
    messageContainer.classList.add('show');
    setMessageText('Black');
    currentGameId = null;
    setHeader('Click on a player to start a game!');
  } else if (gameState === 1) {
    messageContainer.classList.add('show');
    setMessageText('White');
    currentGameId = null;
    setHeader('Click on a player to start a game!');
  } else if (gameState === 3) {
    messageContainer.classList.add('show');
    setMessageText('Game drawn!');
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

async function startNewGame(player1, player2) {
  if (player1 === player2) return;
  await axios.get(`/play/newgame/${player1}|${player2}`).catch(err => console.log(err));
}
