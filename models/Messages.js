const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required:true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sendeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    messageText: {
        type: String,
        required: true
    },

    messageTime: {
        type: Date,
        required: true,
        default: Date.now
    }

});

module.exports = mongoose.model('Message', messageSchema);