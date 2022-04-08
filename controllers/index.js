const bcrypt = require("bcrypt");
const passport = require("passport");

// Loading Model
const User  = require("../models/User");
const Otp = require('../models/Otp');

const homePage = (req, res) => {
    res.render('frontend/index');
}

const aboutPage =  (req, res) => {
    res.render('frontend/about');
}

const contactPage =  (req, res) => {
    res.render('frontend/contact');
}

const signInPage = (req, res) => {
    res.render('frontend/login')
}

const signupPage = (req, res) => {
    res.render('frontend/signup');
};

const resetPasswordPage = (req, res) => {
    res.render('frontend/reset-password');
}

const resetPasswordFunction = (req, res) => {
    
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
}

const signupFunction = (req, res) => {
    
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
 
 }

const signInFunction = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
}

const logoutFunction = (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged Out");
    res.redirect("/signin");
}

const googleOauth = passport.authenticate('google', { scope: ['profile'] });

const googleCallbackFunction = (req, res) => {
  
   // Inserted Sucessfully
   res.status(200).json({
       message: "Account Created Successfully",
       status: true,
       admin: req.admin
   })
   return;
}

module.exports = {
    homePage,
    aboutPage,
    contactPage,
    signInPage,
    signInFunction,
    resetPasswordPage,
    resetPasswordFunction,
    googleOauth,
    googleCallbackFunction,
    signupPage,
    signupFunction,
    logoutFunction
}