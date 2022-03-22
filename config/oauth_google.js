const GoogleStrategy = require('passport-google-oauth20');
const bcrypt = require('bcrypt');

// Loadiong User Email

module.exports = function(passport) {

    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
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