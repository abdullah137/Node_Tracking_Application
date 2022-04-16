const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt');

// Loading User Models
const Users = require('../models/User');

module.exports = function(passport) {

    passport.use(
        new FacebookStrategy({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            profileFields: ['id', 'displayName', 'photos', 'email'],
            callbackURL: '/users/auth/facebook/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            
            const randomOtp = Math.floor(Math.random()*90000)+10000;
            
            
           let userId = profile.id;
           let userName = profile.username;
           let firstName = profile.name.familyName;
           let lastName = profile.name.givenName;
           let emails = profile.emails[0].value

            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(profile.emails[0].value, salt)

           // creating our insert object
           const User = {
               userName: profile.id,
               firstName: profile.name.familyName,
               lastName: profile.name.givenName,
               email: profile.emails[0].value,
               password: hashPassword,
               dob: "0000-00-00",
               profileImg: ''
           }

          // Check into the Databse if record is already there
        try {

            let user = await Users.findOne({
                email: profile.emails[0].value
            })

            if(user) {
                done(null, user);
            }else {
                user = await Users.create(User)
                done(null, user)
            }

        } catch(error) {
            console.log(error);
            console.log("Sorry, An error Occured Here")
        }

        })
    )

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Users.findById(id, function(err, user) {
            done(err, user);
        })
    });
}