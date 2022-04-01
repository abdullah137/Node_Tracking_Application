const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Importing the users table
const Users = require('../models/User');
const Friends = require('../models/Friends');
const Notifications = require('../models/Notification');

const { ensureAuthenticated, forwardAuthenticated }  = require("../middleware/auth");

router.get('/dashboard', (req, res) => {
    const user = req.user
    const userName = req.user.userName
    const fullName = req.user.firstName+' '+req.user.lastName
    res.render('user/account-dashboard', { user, userName, fullName });
})


router.get('/friends', async (req, res) => {

    const userName = req.user.userName
    const userId = req.user.id

    // getting the list of friends
    const friends = await Users.find({ userName: { $ne: userName } }).lean();

   // console.log(friends)
    res.render('user/account-search-friends', { userName, friends, userId });
})

router.get('/friend-cancel/:id', async (req, res) => {
  
    // declaring the needed variables
    const sessionId = req.user.id
    const targetId = req.params.id

    // check if the param is empty
    if(!targetId) {
        // render them to the page 404
        res.sendStatus(404).render('/error/404')
    }

    try {
        
        // check if the user exists
        const userCheck = await Users.findById(targetId).exec();

        if(!userCheck) {
            // rendering the error to 404
            res.sendStatus(403).render('/error/403')
        }

        // check if the session user exist
        const sessionCheck = await Users.findById(sessionId).exec();

        if(!sessionCheck) {
            // rendering the error to 404
            res.sendStatus(400).render('/error/404')
        }

        // Deleting the friends records from the tabel from the
        const deleteFriendRequest = await Friends.findByIdAndDelete(targetId);

        if(!deleteFriendRequest) {
            // rendering them to 500
            res.sendStatus(500).render('/error/500');
        }else {
            
            // Insert into the database
            req.flash("friend_msg_decline", "Your friend request has been declined 😓");
            res.redirect(`/user/friends`)
        }

    } catch (error) {
        console.error(error);
        res.redirect('/error/500');
    }
    
})

router.get('/friend-decline/:id', async (req, res) => {

    // declaring the needed variables
    const sessionId = req.user.id
    const targetId = req.params.id

    // check if the param is empty
    if(!targetId) {
        // render them to the page 404
        res.sendStatus(404).render('/error/404')
    }

    try {
        
        // check if the user exists
        const userCheck = await Users.findById(targetId).exec();

        if(!userCheck) {
            // rendering the error to 404
            res.sendStatus(403).render('/error/403')
        }

        // check if the session user exist
        const sessionCheck = await Users.findById(sessionId).exec();

        if(!sessionCheck) {
            // rendering the error to 404
            res.sendStatus(400).render('/error/404')
        }

        // Deleting the friends records from the tabel from the
        const deleteFriendRequest = await Friends.findByIdAndDelete(targetId);

        if(!deleteFriendRequest) {
            // rendering them to 500
            res.sendStatus(500).render('/error/500');
        }else {
            
            // Insert into the database
            req.flash("friend_msg_decline", "Your friend request has been declined 😓");
            res.redirect(`/user/friends`)
        }

    } catch (error) {
        console.error(error);
        res.redirect('/error/500');
    }

})

router.get('/friend-request/:id', async (req, res) => {
    
    const loggedUser = req.user.id
    const targetId = req.params.id

    req.body.source_id = loggedUser
    req.body.target_id = targetId

     // check if the param is empty
     if(!targetId) {
        // render them to the page 404
        res.sendStatus(404).render('/error/404')
    }
    
    try {

    // check if the user exist
    const userCheck = await Users.findById(targetId).exec();

    // check if the session user is active
    const sessionCheck = await Users.findById(loggedUser).exec();

    if(!userCheck) {
        // render the person the home 500 page
        res.sendStatus(502).render('/error/502');   
    }

    if(!sessionCheck) {
        // render the person the home page
        res.sendStatus(500).render('/error/502');
    }

    // Inserting the records on the chat request
    const insertFriends = await Friends.create(req.body);

    if(!insertFriends) {
        // render the person home
        res.render('/error/500')

    } else {
    
    // Check if the user is already in users list
    const frdCheckList = await Users.find({ _id: loggedUser, frdList: { $in: [ req.params.id ] } });
        
    // Updates the list of friends
    const updateFrdList =  await Users.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
                frdList: loggedUser
            }
        },
        { new: true});
    
    // Initializing the vairables
    const senderId = new mongoose.Types.ObjectId(loggedUser);
    const targetId = new mongoose.Types.ObjectId(req.params.id);

    
    const saveNotification = await Notifications.create({ 
        senderId: senderId,
        targetId: targetId,
        type: 'frd_add'
    });

    // if it's there then remend them that the friend request is already sent,
    // then insert into the notification table
    
    
    //else then add them to the friend array
    // then them to the user array

    // Insert into the database
    req.flash("friend_msg_success", "Your friend request has been sent successfully");
    res.redirect(`/user/friends`)

    } 
        
    } catch (error) {
        console.log(error);
        res.redirect('/error/500');    
    }

});

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
    

    // then insert inside the data

    
})

// router.get('/friends', ensureAuthenticated, async (req, res) => {
    
//     // getting friends list
//     const friends = await Users.find({}).lean();
//     // get usename
//     const userName = req.user.userName
//     console.info(friends);
//     res.render('user/account-members', { friends });
// })

router.get('/track', ensureAuthenticated, (req, res) => {
    res.render('user/account-track');
})  

router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('user/account-profile');
})

module.exports = router;