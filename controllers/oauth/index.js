const passport = require('passport');

const googleOauth = passport.authenticate('google', { scope: ['profile', 'email'] })

const googleCallbackFunction = (req, res) => {
    res.redirect('/users/dashboard');
  }

module.exports = { googleOauth,googleCallbackFunction }