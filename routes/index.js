const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('frontend/index');
});

router.get('/about-us', (req, res) => {
    res.render('frontend/about');
});

router.get('/contact-us', (req, res) => {
    res.render('frontend/contact');
});

router.get('/signin', (req, res) => {
    res.render('frontend/login')
});

router.get('/signup', (req, res) => {
    res.render('frontend/signup');
})

router.get('/reset-password', (req, res) => {
    res.render('frontend/reset-password');
})

module.exports = router;