const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    profileIntro: {
        type: String,
        default: ''
    },
    friends: [
        {
            awaitList: {
                type: Array
            },
            acceptList: {
                type: Array
            },
            declineList: {
                type: Array
            }
        }
    ],
    frdList: {
        type: Array,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    lastLogin: {
        type: Date,
        default: Date.now
     }



});

module.exports = mongoose.model('User', UserSchema);