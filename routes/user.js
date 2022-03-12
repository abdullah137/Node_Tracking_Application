const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('user/account-dashboard');
})

router.get('/chat', (req, res) => {
    res.render('user/account-chat');
})

router.get('/friends', (req, res) => {
    res.render('user/account-members');
})

router.get('/track', (req, res) => {
    res.render('user/account-track');
})

router.get('/profile', (req, res) => {
    res.render('user/account-profile');
})

module.exports = router;