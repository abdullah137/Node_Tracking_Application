const moment = require('moment');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}


function object_With_resume(username, session_id, text) {
    return {
        username,
        session_id,
        text,
        time: moment().format('h:mm a')
    }
    
}


module.exports = { formatMessage, object_With_resume };