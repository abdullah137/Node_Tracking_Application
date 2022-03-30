const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");

// Loading Model
const User  = require("../models/User");
const Otp = require('../models/Otp');

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

router.post('/reset-password', (req, res) => {
    
    // get user input
    const email = req.body.email;
    let errors = [];

    // ensuring it is field
    if(!email) {
        errors.push({ msg: "Please Your Email is Required" });
        res.render('frontend/reset-password', { errors, email });
    }

    // Check if it's a valid email
    var emailRex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!email.match(emailRex)) {
        errors.push({ msg: "Please Enter A Valid Email" });
        res.render('frontend/reset-password', { email, errors })
    }


    // Check if the email exist
    User.findOne({ email: email }).then(user => {
        
        if(!user) {
            errors.push({ msg: "Sorry, Email Do Not Exists " })
            res.render('frontend/reset-password', { email, errors })
        }else {


            // Function that generated strings
            function generateUrl(length) {
                var result           = '';
                var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for ( var i = 0; i < length; i++ ) {
                  result += characters.charAt(Math.floor(Math.random() * 
             charactersLength));
               }
               return result;
            }

            let ranChar = generateUrl(10);

            // Generate a random string
            let url = req.url+'/change-password?'+ranChar;

            let otp = Math.floor(Math.random()*90000) + 10000;

            conso

            const user_id  = req.user.id;

            console.log(req.user);
            // Inserting the otp code
            // const OtpCode = new Otp({
            //     user_id, otp, url
            // });

            // OtpCode.save().then(code => {

            //     // logging
            //     console.log('It has been saved')
            // });


            // Sending an Email With an Otp
            console.log("Email Sent :maail");

            // Inserting the 
        }
    });


    // Then send an otp uisng an email

});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));


router.post('/signup', (req, res) => {
    
   console.log(req.body)
   // getting the user inputs using post request 
   const { 
        firstName,
        lastName, 
        email, 
        userName,
        password,
       dob,
       phone,
        terms
    } = req.body;
   let errors = []; 


   // ensuring all users field is field
   if(!firstName || !lastName || !email || !password || !userName || !dob || !phone ) {
       errors.push({ msg: "Please Enter 🙏 Fill Fields" });
    }

    // if(!terms) {
    //     errors.push({ msg: " Sorry, Kindly Accept Our Terms and Conditons " })
    // }

   // Ensuring that user password is more than 6 characters
   if(password.length < 6) {
        errors.push({ msg: "Password must be at least 6 Characters" });
   }

   if(errors.length > 0 ) {
       res.render('frontend/signup', { errors, firstName, lastName, email, userName, dob, phone, terms });
   }else {
        
    // Find if the user exits
    User.findOne({ $or: [ { email: email }, { userName: userName }  ] }).then(user => {
      if(user) {
          errors.push({ msg: "Email Or Username Already Exist" });
          res.render('frontend/signup', { errors, firstName, lastName, email, userName, password, dob, phone, terms });
      } else {

          // Setting the user object to be updated
        const newUser = new User({
            userName, firstName, lastName, phone, email, password, dob
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