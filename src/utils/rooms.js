const rooms = []

// add rooms to array
const addRooms = (room) => {
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

// example rooms
addRooms({
    room: 'Seattle',
    members: 2
})
addRooms({
    room: 'Renton',
    members: 0
})
addRooms({
    room: 'Bellevue',
    members: 10
})
addRooms({
    room: 'Lynnwood',
    members: 0
})

console.log(rooms)

// remove rooms from array when all users leave
const removeRooms = rooms.filter(room => room.members > 0);
console.log(removeRooms)

// removeRooms(rooms)


// console.log(rooms[0].members)

module.exports = {
    addRooms,
    removeRooms
}