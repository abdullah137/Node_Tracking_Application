const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/about-us', (req, res) => {
    res.render('about');
});

router.get('/contact-us', (req, res) => {
    res.render('contact');
});

router.get('/signin', (req, res) => {
    res.render('login')
});

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.get('/reset-password', (req, res) => {
    res.render('reset-password');
})

module.exports = router;