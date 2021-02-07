const squares = document.querySelectorAll('.board-square');
const imgSourceBlack = './images/black-stone.png';
const imgSourceWhite = './images/white-stone.png';

function createStone(square, color) {
  if (square.hasChildNodes()) return;

  let stoneImg = document.createElement('img');
  stoneImg.setAttribute('src', `${color === 'white' ? imgSourceWhite : imgSourceBlack}`);
  stoneImg.setAttribute('class', 'stone');
  square.appendChild(stoneImg);
}

function clearBoard() {
  const stones = document.querySelectorAll('.stone');
  stones.forEach(s => {
    const parent = s.parentElement;
    parent.removeChild(s);
  });
}

function setHeaderForGame(firstPlayer, secondPlayer) {
  document.querySelector('#welcome').innerHTML = `new game started: ${firstPlayer} vs. ${secondPlayer}`;
}

function setHeader(text) {
  document.querySelector('#welcome').innerHTML = text;
}

document.querySelector('#close-message').addEventListener('click', () => {
  document.querySelector('#message-container').classList.remove('show');
  clearBoard();
});

function setMessageText(text) {
  document.querySelector('#message-text').innerText = `${text} won the game!`;
}

function setPlayersStatus(players, status) {}
