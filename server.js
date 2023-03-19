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

// io.on('connection', (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on('chat message', (data) => {
//     console.log(`User: ${socket.id} message: ${data.message} to recipient: ${data.recipient}`);
//     if (data.recipient === '') {
//       socket.broadcast.emit('chat message', data.message);
//     } else {
//       socket.to(data.recipient).emit('chat message', data.message);
//       console.log(data.message);
//     }
//   });
// });



http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

// TODO: 
// 1. figure out how to add nicknames/ID's
// 1.5 maybe figure out how to save message for 24 hours
// 2. maybe figure out rooms/private messaging?
// if not then figure out how to use it as a general announcement feature
// use handlebars and display this how you would want this 
