const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const cors = require('cors');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('chat message', (data) => {
    //console.log(data);
    console.log(`User: ${socket.id} message: ${data.message} to recipient: ${data.recipient}`);
    if (data.recipient === '') {
    io.emit('chat message', data.message, data.username);
    } else {
      socket.to(data.recipient).emit('chat message',  data.message, data.username);
      io.in(data.sender).emit('chat message', data.message, data.username)
      console.log(data.sender);
    }
  });

  socket.on("join-room", (room, cb) => {
    socket.join(room)
    cb(`Joined ${room}`)
  })
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
