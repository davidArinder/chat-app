// client side

const socket = io() // connect to server

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    
    const message = e.target.elements.message.value
    
    socket.emit('sendMessage', message)
})