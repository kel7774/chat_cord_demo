const chatForm = document.getElementById("chat-form");

const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

// message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get message text from html form
  const msg = e.target.elements.msg.value;

  // emit message to server
  socket.emit("chatMessage", msg);
});