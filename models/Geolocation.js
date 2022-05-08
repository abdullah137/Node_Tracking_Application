const mongoose = require('mongoose');
const geolocationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    xAxis : {
        type: Number,
        required: true
    },
    yAxis: {
        type: Number,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model('geolocationSchema', geolocationSchema)