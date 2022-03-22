const express = require('express');
const router = express.Router();

<<<<<<< HEAD
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
=======
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
>>>>>>> 4742f51affda7f4638661629ec91c40ef792f10b
    res.render('user/account-profile');
})

module.exports = router;