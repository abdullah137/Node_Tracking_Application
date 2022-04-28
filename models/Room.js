const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({

    rId: {
        type: String,
        required: true
    },

    rType: {
        type: String,
        enum: ['Private', 'Group'],
        required: true,
    },
    rList : {
        type: Array,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);