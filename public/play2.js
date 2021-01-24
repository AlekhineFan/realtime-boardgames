const socket = io("http://localhost:3000");
const playerName = localStorage.getItem("playerName");
const squares = document.querySelectorAll(".board-square");

let currentGameId;

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

socket.on("newGameStarted", gameId => {
  console.log(gameId);
  currentGameId = gameId;
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
