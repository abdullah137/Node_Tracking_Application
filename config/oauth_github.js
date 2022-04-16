var GitHubStrategy = require('passport-github2').Strategy;
var brycpt = require('bcrypt');

// Loading User Models
const Users = require('../models/User');

module.exports = function(passport) {

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/users/auth/github/callback"
      },

      function(accessToken, refreshToken, profile, cb) {

            console.log(profile);

      }

    ));
    

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Users.findById(id, function(err, user) {
            done(err, user);
        })
    });
}
