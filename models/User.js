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
    profileImg: {
        type: String,
        required: false
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    lastLogin: {
        type: Date,
        default: Date.now
     },

    isStatus: {
        type: Boolean,
        enum: [ true, false ],
        default: false
    },
    methodRegistration: {
        type: String,
        enum: ['Oauth', 'Manual'],
        required: true
    }
    
});

module.exports = mongoose.model('User', UserSchema);