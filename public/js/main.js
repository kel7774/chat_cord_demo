const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//get user name and room from url

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// join chatroom
socket.emit('joinRoom', { username, room });

// get room & users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
})

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message)
  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get message text
  let msg = e.target.elements.msg.value;
  msg = msg.trim();
  if(!msg) {
    return false;
  }
  // Emit message to server
  socket.emit('chatMessage', msg);

  // clear input & then focus
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  let p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);
  let para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// add users to DOM

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}