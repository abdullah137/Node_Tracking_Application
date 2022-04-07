const TwitterStrategy = require('passport-twitter');
const bcrypt = require('bcrypt');

// Loadiong User Email

module.exports = function(passport) {

    passport.use(
        new TwitterStrategy({
            clientID: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
            callbackURL: '/auth/twitter/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            let check_user = await User.findone({ email: 'test@gmail.com' });
            
            if(check_user) {
                console.log("User exsit")
            }else {
                console.log("user does not exit")
            }
        }
        )
    )
}