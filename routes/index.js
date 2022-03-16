const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");
const { ensureAuthenticated, forwardAuthenticated }  = require("../middleware/auth");

// Loading Model
const User  = require("../models/User");

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
});

router.get('/reset-password', (req, res) => {
    res.render('frontend/reset-password');
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));


router.post('/signup', (req, res) => {

   // getting the user inputs using post requst 
   const { firstName, lastName, email, userName, password, password2 } = req.body;
   let errors = []; 

   console.log(req.body)

   // ensuring all users field is field
   if(!firstName || !lastName || !email || !password || !userName ) {
       errors.push({ msg: "Please Enter 🙏 Fill Fields" });
    }

   // checking to see if the passwords match
   if(password != password2) {
        errors.push({ msg: "Password do not Match" });
   }

   // Ensuring that user password is more than 6 characters
   if(password.length < 6) {
        errors.push({ msg: "Password must be at least 6 Characters" });
   }

   if(errors.length > 0 ) {
       res.render('frontend/signup', { errors, firstName, lastName, email, userName,password,password2 });
   }else {
        
    // Find if the user exits
    User.findOne({ $or: [ { email: email }, { userName: userName }  ] }).then(user => {
      if(user) {
          errors.push({ msg: "Email Or Username Already Exist" });
          res.render('frontend/signup', { errors, firstName, lastName, email, userName, password });
      } else {

          // Setting the user object to be updated
        const newUser = new User({
            firstName, lastName, userName, email, password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user => {


                    // then create an email function to ther user

                    req.flash("success_msg", "Congratulations!!! Account Created Successfully");
                    res.redirect("/signin");

                }).catch(err => console.log(err));
            });
        })
      }  
    })
        
   }  

});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged Out");
    res.redirect("/signin");
});

module.exports = router;