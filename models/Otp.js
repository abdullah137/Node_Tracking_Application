const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    otp_n: {
        type: Number,
        required: true
    },
    otp_url: {
        type: String,
        required: true,
    },
    otp_status: {
        type: String,
        default: '0',
        enum: ['1', '0']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Otp', OtpSchema);