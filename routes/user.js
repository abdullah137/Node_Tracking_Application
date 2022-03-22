const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated }  = require("../middleware/auth");

router.get('/dashboard', (req, res) => {
    const user = req.user
    res.render('user/account-dashboard', { user });
})

router.get('/chat', ensureAuthenticated, (req, res) => {
    res.render('user/account-chat');
})

router.get('/friends', ensureAuthenticated,(req, res) => {
    res.render('user/account-members');
})

router.get('/track', ensureAuthenticated, (req, res) => {
    res.render('user/account-track');
})

router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('user/account-profile');
})

module.exports = router;