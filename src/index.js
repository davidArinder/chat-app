// set up server
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ username, room }) => { // join room
        socket.join(room)

        socket.emit('message', generateMessage('Welcome!')) // send to single user
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`)) // send to everyone except user
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        // filter profanity
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        // if no profanity, send message
        io.to('Renton').emit('message', generateMessage(message)) // send to all users
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback() // acknowledgement that location sent
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})