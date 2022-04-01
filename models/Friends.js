const mongoose = require('mongoose');

const FriendSchema = new mongoose.Schema({

    source_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    target_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    frd_status: {
        type: String,
        default: 0,
        enum: [0, 1]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
});

module.exports = mongoose.model('Friends',FriendSchema)