const express = require('express');
const router = express.Router();

const passport = require('passport');

const { 
      googleOauth,
      googleCallbackFunction
    } = require('../../controllers/oauth/index');

router.get('/google', googleOauth);

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleCallbackFunction);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: '/users/dashboard', failureRedirect: '/' }), (req, res) => {
 
  const _status = req.user.isStatus
    
  if(!_status) {
      res.redirect('/users/activate');
  }else {
      res.redirect('/users/dashboard')
  } 

});

router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/user/signup' }), function(req, res) {

  const _status = req.user.isStatus
    
    if(!_status) {
        res.redirect('/users/activate');
    }else {
        res.redirect('/users/dashboard')
    }
})

module.exports = router;