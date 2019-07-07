// set up server
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', 'Welcome!') // send to single user
    socket.broadcast.emit('message', 'A new user has joined') // send to everyone except user

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        // filter profanity
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        // if no profanity, send message
        io.emit('message', message) // send to all users
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback() // acknowledgement that location sent
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})