// client side
const socket = io() // connect to server

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }) // connect to chat room

// function to correctly scroll/not scroll to bottom 
const autoscroll = () => {
    // new message element
    const $newMessage = $messages.lastElementChild

    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messages.offsetHeight

    // height of messages container
    const containerHeight = $messages.scrollHeight

    // how far you have scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight // scroll to bottom
    }
}

// Messages
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a') // format timestamp
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


// Location
socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a') // format timestamp
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

// send messages
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault() // prevent page refresh
    
    $messageFormButton.setAttribute('disabled', 'disabled') // disables form once it's been submitted

    const message = e.target.elements.message.value
    
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled') // enables form after acknowledgement callback
        $messageFormInput.value = '' // clear input after message sent
        $messageFormInput.focus() // move focus back to input after message sent
        if (error) {
            return console.log(error)
        }

        console.log('Message delivered') // acknowledgement for user
    })
})

// send location
$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled') // disables send location button after submit

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled') // enables send location after acknowledgement callback
            console.log('Location shared') // acknowledge location shared
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error) // error popup
        location.href = '/' // send them back to home page
    }
})