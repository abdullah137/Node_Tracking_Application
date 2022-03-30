const express = require('express');
const router = express.Router();

// Importing the users table
const Users = require('../models/User');

const { ensureAuthenticated, forwardAuthenticated }  = require("../middleware/auth");

router.get('/dashboard', (req, res) => {
    const user = req.user
    const userName = req.user.userName
    const fullName = req.user.firstName+' '+req.user.lastName
    res.render('user/account-dashboard', { user, userName, fullName });
})

router.get('/chat/:id', ensureAuthenticated, (req, res) => {
    const user_id = req.params.id
    const session_id = req.user.id
    // the room id must been saved in the dastabase
    // and generated from the database
    const room_id = 1000;
    res.render('user/account-chat', { user_id, session_id, room_id });
})

router.post('/message', (req, res) => {
    
    // collecting all request from the database
    const senderId = req.body.sender;
    const clientId = req.body.sendee;
    const text = req.body.message;

    // Checking to see if the 
    if( senderId == "" || clientId == "" || text == "") {
        res.statusCode(400).json({
            msg: "empty",
            status: false
        })
        return;
    } 

    // Check if the sender or the sendee does not exist
    const checkUser = Users.find({  })

    // then insert inside the data

    
})

router.get('/friends', ensureAuthenticated, async (req, res) => {
    
    // getting friends list
    const friends = await Users.find({}).lean();
    // get usename
    const userName = req.user.userName
    console.info(friends);
    res.render('user/account-members', { friends });
})

router.get('/track', ensureAuthenticated, (req, res) => {
    res.render('user/account-track');
})  

router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('user/account-profile');
})

module.exports = router;