const FacebookStrategy = require('passport-facebook');
const bcrypt = require('bcrypt');

// Loadiong User Email

module.exports = function(passport) {

    passport.use(
        new FacebookStrategy({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEOOK_CLIENT_SECRET,
            callbackURL: '/auth/facebook/callback'
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