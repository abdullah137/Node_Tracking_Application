const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User Model
const User = require("../models/User");

module.exports = function (passport) {

    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

            // Match Users
            User.findOne({
                email: email
            }).then(user => {

                console.log("it is here now");

                if(!user) {
                    return done(null, false, { message: "That email is not registered" })
                }

                // Check to see if password Match
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch) {
                        return done(null, user);
                    }else {
                        return done(null, false, { message: "Password Incorrect" });
                    }
                });


            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    })

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        })
    })
}