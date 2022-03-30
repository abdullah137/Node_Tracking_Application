const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    userList: {
        type: Array,
        require: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Group', groupSchema);