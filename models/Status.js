const mongoose = require('mongoose');
const statusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Number,
        enum: [ 0, 1 ]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date   
    }
});

module.exports = mongoose.model('Status', statusSchema);