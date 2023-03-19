const socket = io('http://localhost:3000');
socket.on('connect', () => {
    console.log("server connected");
})

const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const room = document.getElementById('room');
const join = document.getElementById('join')
const username = document.getElementById('username')

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      // Emit a 'chat message' event with an object containing both the message and the recipient ID
      socket.emit('chat message', { message: input.value, recipient: room.value, sender: socket.id, username: username.value});
      console.log(username);
      input.value = '';
    }
  });
  
  socket.on('chat message', function(message, username) {
    const li = document.createElement('li');
    li.textContent = `${username}: ${message} `
    console.log(li);
    messages.appendChild(li);
    window.scrollTo(0, document.body.scrollHeight);
  });

  join.addEventListener('click', function() {
    const roomName = room.value
    socket.emit('join-room', roomName, message => {
        displayMsg(message)
    })
  })

  function displayMsg(message) {
    const li = document.createElement('li');
    li.textContent = message 
    console.log(li);
    messages.appendChild(li);
    window.scrollTo(0, document.body.scrollHeight);
  }
 
  