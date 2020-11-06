const express = require("express");
const socketio = require("socket.io");
const app = express();

const server = app.listen(3000);
const io = socketio(server);

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

io.on("connect", (socket) => {
  socket.on("messageToServer", (msg) => {
    io.emit("messageFromServer", { msg });
  });
});
