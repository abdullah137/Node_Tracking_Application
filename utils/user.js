const users = [];

// Join user to chat
function userOnline(id, session_id, room) {
    const user = { id, session_id, room };

    users.push(user);

    return user;
}  

// Get current user
function getCurrentUser(id) {
    return users.find( user => user.id === id );
}

// user leave chat / user offline
function userOffline(id) {
    const index = users.findIndex( user => user.id === id );

    if( index !== -1 ) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = {
    userOffline,
    getRoomUsers,
    userOnline,
    getCurrentUser
}