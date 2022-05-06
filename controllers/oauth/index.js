const passport = require('passport');

const googleOauth = passport.authenticate('google', { scope: ['profile', 'email'] })

const googleCallbackFunction = (req, res) => {
  
    const _status = req.user.isStatus
    
    if(!_status) {
        res.redirect('/users/activate');
    }else {
        res.redirect('/users/dashboard')
    }
   
  }

module.exports = { googleOauth,googleCallbackFunction }