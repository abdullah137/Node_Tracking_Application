const express = require('express');
const router = express.Router();
const passport = require("passport");

const { homePage,
     aboutPage, 
     contactPage, 
     signInPage,
      signInFunction, 
      resetPasswordFunction,
      resetPasswordPage,
      googleOauth,
      googleCallbackFunction,
      signupPage,
      signupFunction,
      logoutFunction   
    } = require('../controllers/index');
const { route } = require('./user');

router.get('/', homePage);

router.get('/about-us', aboutPage);

router.get('/contact-us', contactPage);

router.get('/signin', signInPage);

router.get('/signup', signupPage);

router.get('/reset-password', resetPasswordPage);

router.post('/reset-password', resetPasswordFunction);

router.get('/auth/google', googleOauth);

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/google/failure' }), googleCallbackFunction);

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['user_friends', 'manage_pages', 'profile'] }));

router.post('/signup', signupFunction);

router.post('/signin', signInFunction);

router.get('/logout', logoutFunction);

module.exports = router;