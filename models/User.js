const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
<<<<<<< HEAD

=======
>>>>>>> 4742f51affda7f4638661629ec91c40ef792f10b
    userName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
<<<<<<< HEAD
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
=======
>>>>>>> 4742f51affda7f4638661629ec91c40ef792f10b
    email: {
        type: String, 
        required: true
    },
<<<<<<< HEAD
    password: {
        type: String,
        required: true,
    },
    profileIntro: {
        type: String,
        default: ''
=======
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
>>>>>>> 4742f51affda7f4638661629ec91c40ef792f10b
    },
    createdAt: {
        type: Date,
        default: Date.now
<<<<<<< HEAD
    },
    
    lastLogin: {
        type: Date,
        default: Date.now
=======
>>>>>>> 4742f51affda7f4638661629ec91c40ef792f10b
    }
});

module.exports = mongoose.model('User', UserSchema);