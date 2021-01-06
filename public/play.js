document.addEventListener("DOMContentLoaded", () => {
  const socket = io("http://localhost:3000");
  socket.on("connect", () => {
    console.log(`Connected! id: ${socket.id}`);
    const name = localStorage.getItem("playerName");
    socket.emit("playerJoined", name);
    document.querySelector("#welcome").innerText = `Have a good game, ${name}!`;
  });

  const squares = document.querySelectorAll(".board-square");
  const imgSourceBlack = "./images/black-stone.png";

  let clickCounter = 0;

  squares.forEach(square => {
    square.addEventListener("click", () => {
      socket.emit("messageToServer", {
        selectedSquareId: square.id,
        player: clickCounter % 2 === 0 ? "first" : "second"
      });
    });
  });

  socket.on("messageFromServer", dataFromServer => {
    console.log(dataFromServer);
    let opponentMoveId = dataFromServer.msg.selectedSquareId;
    squares.forEach(square => {
      if (square.id === opponentMoveId) {
        //square.style.backgroundColor = clickCounter % 2 === 0 ? "blue" : "red";
        square.innerHTML += `<img src="${imgSourceBlack}" class="stone"></img>`;
        clickCounter++;
      }
    });

    let gameState = dataFromServer.msg.gameState;

    if (gameState === 0) {
      alert("First player won!");
    } else if (gameState === 1) {
      alert("second player won!");
    }
  });

  socket.on("sendPlayerPool", playerPool => {
    console.log(playerPool);
  });

  socket.on("refreshPlayerPool", pool => {
    console.log(pool);
    let players = "";
    pool.forEach(p => {
      players += `<li>${p}</li>`;
    });
    document.querySelector("#players-list").innerHTML = players;
  });
});
