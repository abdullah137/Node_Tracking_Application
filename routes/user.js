const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated }  = require("../middleware/auth");

// importing the user controller
const { 
    dashboard,
    friends,
    friendAccept,
    friendDecline,
    friendRequest,
    chatPage,
    messageFunction,
    allFriends,
    trackFriends,
    userProfile,
    updateProfile,
    profileImg
 } = require('../controllers/user')

router.get('/dashboard', dashboard)

router.get('/friends',  friends)

router.get('/friend-request/:id', friendRequest);

router.get('/friend-accept/:id', friendAccept)

router.get('/friend-decline/:id', friendDecline)

router.get('/chat/:id', ensureAuthenticated, chatPage)

router.post('/message', messageFunction)

router.get('/friends', ensureAuthenticated, allFriends)

router.get('/track', ensureAuthenticated, trackFriends)  

router.get('/profile', ensureAuthenticated, userProfile)

router.put('/update-profile', ensureAuthenticated, updateProfile);

router.post('/image', ensureAuthenticated, profileImg);

module.exports = router;