document.addEventListener("DOMContentLoaded", () => {
  const socket = io("http://localhost:3000");
  socket.on("connect", () => {
    console.log(`Connected! id: ${socket.id}`);
  });

  const squares = document.querySelectorAll(".board-square");

  let selectedSquareId;
  let idCounter = 1;
  let clickCounter = 0;

  squares.forEach((square) => {
    square.setAttribute("id", `${idCounter}`);
    square.addEventListener("click", () => {
      selectedSquareId = square.id;
      socket.emit("messageToServer", { selectedSquareId });
    });
    idCounter++;
  });

  socket.on("messageFromServer", (dataFromServer) => {
    let opponentMoveId = dataFromServer.msg.selectedSquareId;
    squares.forEach((square) => {
      if (square.id === opponentMoveId) {
        square.style.backgroundColor = clickCounter % 2 === 0 ? "blue" : "red";
        clickCounter++;
      }
    });
  });
});
