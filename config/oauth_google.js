const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Loading Our Model
const Users = require('../models/User');

module.exports = function(passport) {

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/users/auth/google/callback'
    }, async(accessToken, refreshToken, profile, done) => {


        const randomOtp = Math.floor(Math.random()*90000)+10000;
    
            // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(profile.emails[0].value, salt);

        const User = {
            userName: profile.id,
            firstName: profile.name.familyName,
            lastName: profile.name.givenName,
            email: profile.emails[0].value,
            password: hashPassword,
            dob: "0000-00-00",
            profileImg : ''
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
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Users.findById(id, function(err, user) {
            done(err, user);
        })
    });
}
