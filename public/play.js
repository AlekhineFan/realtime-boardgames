document.addEventListener("DOMContentLoaded", () => {
  const socket = io("http://localhost:3000");
  let playerName = "";

  socket.on("connect", () => {
    console.log(`Connected! id: ${socket.id}`);
    playerName = localStorage.getItem("playerName");
    socket.emit("playerJoined", {
      playerName: playerName,
      socketId: socket.id
    });
    document.querySelector(
      "#welcome"
    ).innerText = `Have a good game, ${playerName}!`;
  });

  const squares = document.querySelectorAll(".board-square");
  const imgSourceBlack = "./images/black-stone.png";
  const imgSourceWhite = "./images/white-stone.png";

  let gameid;

  const createStone = (square, color) => {
    let stoneImg = document.createElement("img");
    stoneImg.setAttribute(
      "src",
      `${color === "white" ? imgSourceWhite : imgSourceBlack}`
    );
    stoneImg.setAttribute("class", "stone");
    square.appendChild(stoneImg);
  };

  squares.forEach(square => {
    square.addEventListener("click", () => {
      socket.emit("messageToServer", {
        selectedSquareId: square.id,
        gameId: gameId,
        player: playerName
      });
    });
  });

  const startNewGame = (player1, player2) => {
    if (player1 === player2) return;
    axios
      .get(`/play/newgame/${player1}|${player2}`)
      .then(res => (gameId = res.data.gameId))
      .then(console.log(gameId))
      .catch(err => console.log(err));
  };

  socket.on("messageFromServer", dataFromServer => {
    console.log(dataFromServer);
    let squareId = dataFromServer.msg.selectedSquareId;
    let name = dataFromServer.msg.player;
    squares.forEach(square => {
      if (square.id === squareId) {
        if (name === playerName) {
          createStone(square, "black");
        } else {
          createStone(square, "white");
        }
      }
    });

    let gameState = dataFromServer.msg.gameState;

    if (gameState === 0) {
      alert("First player won!");
    } else if (gameState === 1) {
      alert("second player won!");
    }
  });

  /*socket.on("sendPlayerPool", playerPool => {
    console.log(playerPool);
  });*/

  socket.on("refreshPlayerPool", pool => {
    //console.log(pool);
    let players = "";
    pool.forEach(player => {
      players += `<li>${player}</li>`;
    });
    document.querySelector("#players-list").innerHTML = players;
    document.querySelectorAll("li").forEach(li =>
      li.addEventListener("click", () => {
        startNewGame(playerName, li.innerText);
      })
    );
  });

  socket.on("disconnect", () => {
    socket.emit("disconnect", playerName);
  });
});
