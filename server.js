const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// run when client connects
io.on("connection", (socket) => {
  console.log("New WS connection");
  //to single client, welcome current user
  socket.emit("message", "Welcome to ChatCord");
  // broadcast when user connects, all client except client connecting
  socket.broadcast.emit("message", "A user has joined the chat");
  // all clients
  // io.emit()
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });
  // listen for chatMessage
  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
