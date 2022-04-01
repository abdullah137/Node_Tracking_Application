const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['frd_add', 'frd_remove', 'frd_accept', 'frd_reject', 'grp_add'],
        required: true,
    },
    seen_status: {
        type: String,
        default: 0,
        enum: [ 0, 1, 2]
    },
    delivered_status: {
        type: String,
        default: 0,
        enum: [ 0, 1, 2 ]
    },
    notificationTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notifications', notificationSchema);