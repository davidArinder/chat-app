const rooms = []

// add rooms to array
const addRooms = (room) => {
    // check if room already exists
    if (room) {
        return
    // add room to array
    } else {
        rooms.push(room)
        return rooms
    }
}

// get rooms from array to show
const getRooms = () => {

}

// remove rooms from array when all users leave
const removeRooms = () => {

}

module.exports = {
    addRooms
}