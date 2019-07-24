// set up server
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
// const Filter = require('bad-words') // uncomment to turn on profanity filter
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser,removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // get rooms list, send to client
    socket.on('getRooms', () => {
        
    })

    // user joins
    socket.on('join', ({ username, room }, callback) => { // join room
        const { error, user } = addUser({ id: socket.id, username, room })
        
        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin','Welcome!')) // send to single user
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`)) // send to everyone except user
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    }),

    //  user is typing message
    // socket.on('typing', (message, callback) => {
    //     const user = getUser(socket.id)
    //     io.to(user.room).emit('typingMessage', user.username + message)
    //     callback()
        // const user = getUser(socket.id) // current user

        // io.to(user.room).emit('message', `${user.username} is typing...`)
        // callback()
        // console.log()
    //})
    
    // send message
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id) // current user
        // const filter = new Filter()

        // filter profanity // uncomment to turn on profanity filter
        // if (filter.isProfane(message)) {
           // return callback('Profanity is not allowed')
        //}

        // if no profanity, send message to all users in current user's room
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    // send location
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id) // current user
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback() // acknowledgement that location sent
    })

    // user leaves room
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left`)) // send message only if user actually joined a room
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})