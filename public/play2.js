const socket = io();
const playerName = localStorage.getItem("playerName");

let currentGameId;
let toTurn;

document.addEventListener("DOMContentLoaded", () => {
  setHeader(`Welcome, ${playerName}`);
});

socket.on("connect", () => {
  socket.emit("playerJoined", { playerName });
});

socket.on("refreshPlayerPool", pool => {
  let playerNames = "";
  pool.forEach(player => {
    playerNames += `<li>${player}</li>`;
  });
  document.querySelector("#players-list").innerHTML = playerNames;
  document.querySelectorAll("li").forEach(li =>
    li.addEventListener("click", () => {
      startNewGame(playerName, li.innerText);
    })
  );
});

socket.on("newGameStarted", newGameData => {
  console.log(newGameData.gameId);
  currentGameId = newGameData.gameId;
  setHeader(newGameData.firstPlayerName, newGameData.secondPlayerName);
});

socket.on("getMoveFromServer", gameData => {
  console.log(gameData);
  const squareId = gameData.squareId;
  const name = gameData.name;
  const squareState = gameData.squareState;
  squares.forEach(square => {
    if (square.id === squareId) {
      const color = squareState === 1 ? "black" : "white";
      createStone(square, color);
    }
  });

  let gameState = gameData.gameState;

  if (gameState === 0) {
    document.querySelector("#message-container").classList.add("show");
    setMessageText("Black");
    currentGameId = null;
  } else if (gameState === 1) {
    document.querySelector("#message-container").classList.add("show");
    setMessageText("White");
    currentGameId = null;
  }
});

squares.forEach(square => {
  square.addEventListener("click", () => {
    socket.emit("sendMoveToServer", {
      selectedSquareId: square.id,
      gameId: currentGameId,
      player: playerName
    });
  });
});

socket.on("disconnect", () => {
  socket.emit("playerDisconnect", playerName);
});

function startNewGame(player1, player2) {
  if (player1 === player2) return;
  axios
    .get(`/play/newgame/${player1}|${player2}`)
    .catch(err => console.log(err));
}
