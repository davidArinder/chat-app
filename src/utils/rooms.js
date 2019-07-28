const rooms = []

// add rooms to array
const addRooms = ({ room }) => {
    // check if room already exists
    if (!room) {
        return console.log('No room')
    // add room to array
    } else {
        rooms.push(room)
        return rooms
    }
}

// get rooms from array to show
const getRooms = () => {

}

const Seattle = addRooms({
    room: 'Seattle',
    members: 2
})
const Renton = addRooms({
    room: 'Renton',
    members: 0
})

// remove rooms from array when all users leave
const removeRooms = (e) => {
    console.log(Seattle[0], Renton[0])
}

removeRooms(rooms)

console.log(rooms)

module.exports = {
    addRooms
}