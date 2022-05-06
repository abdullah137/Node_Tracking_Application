const express = require('express');
const router = express.Router();

// imnporting the controllers
const { 
    signInPage,
    signUpPage,
    resetPasswordPage,
    signUpFunction,
    signInFunction,
    resetPasswordFunction,
    logoutFunciton,
    dashboard,
    friends,
    profile, 
    updateProfile,
    profileImage,
    activatePage,
    completeRegistration,
    checkRegistration
} = require('../../controllers/user/user'); 

const { ensureAuthenticated, forwardAuthenticated }  = require("../../middleware/auth");

router.get('/signin', signInPage);

router.get('/activate', activatePage);

router.get('/signup', signUpPage);

router.get('/reset-password', resetPasswordPage);

router.post('/signup', signUpFunction);

router.post('/signin', signInFunction)

router.post('/reset-password', resetPasswordFunction);

router.get('/logout', logoutFunciton);

router.get('/dashboard', dashboard);

router.get('/friends', friends);

router.get('/profile', profile);

router.put('/update-profile', updateProfile);

router.post('/image', profileImage);

router.post('/complete',  completeRegistration);

router.get('/check/:id', checkRegistration);

module.exports = router;