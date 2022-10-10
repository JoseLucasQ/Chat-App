const io = require('socket.io')(3000)

path = require('path');
const express = require('express');

const app = express();

const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

//set static folder
app.use(express.static(path.join(__dirname, 'public')))

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => console.log('Server is running on port ${PORT}'))