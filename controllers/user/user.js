const bcrypt = require('bcrypt');
const multer = require('multer');
const passport = require('passport');
const path = require('path');

// importing the database model
const Users = require('../../models/User');
const Otp = require('../../models/Otp');

// Multer Configuration
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../public/uploads/'),
    filename: function(req, file, cb) {
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});

// init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('upload');

// check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|svg/;
    // check extensions
    const extname = filetypes.test(path.extname(file.originalname.toLowerCase()));
    // check mime 
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname) {
        return cb(null, true)
    }else {
        cb('Error: Image Only');
    }
}

// CONTROLLERS VARIABLES LIST
const signInPage =  (req, res) => {
    res.render('frontend/login')
};

const signUpPage = (req, res) => {
    res.render('frontend/signup');
};

const resetPasswordPage = (req, res) => {
    res.render('frontend/reset-password');
}

const signUpFunction = (req, res) => {
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
    Users.findOne({ $or: [ { email: email }, { userName: userName }  ] }).then(user => {
      if(user) {
          errors.push({ msg: "Email Or Username Already Exist" });
          res.render('frontend/signup', { errors, firstName, lastName, email, userName, password, dob, phone, terms });
      } else {

          // Setting the user object to be updated
        const newUser = new Users({
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
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/signin',
        failureFlash: true
    })(req, res, next);

};

const resetPasswordFunction = (req, res) => {

    // get user input
    const email = req.body.email;
    let errors = [];

    // ensuring it is field
    if(!email) {
        errors.push({ msg: "Please Your Email is Required" });
        res.render('frontend/reset-password', { errors, email });
        return;
    }

    // Check if it's a valid email
    var emailRex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!email.match(emailRex)) {
        errors.push({ msg: "Please Enter A Valid Email" });
        res.render('frontend/reset-password', { email, errors })
    }


    // Check if the email exist
    Users.findOne({ email: email }).then(user => {
        
        if(!user) {
            errors.push({ msg: "Sorry, Email Do Not Exists " })
            res.render('frontend/reset-password', { email, errors })
            return;
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
            return;
        }
    });

}

const logoutFunciton = (req, res) => {

    req.logout();
    req.flash("success_msg", "You are logged Out");
    res.redirect("/users/signin");

};

const dashboard = (req, res) => {

    const user = req.user
    console.log(user)
    const userName = req.user.userName
    const image = req.user.profileImg;
    const fullName = req.user.firstName+' '+req.user.lastName
    res.render('user/account-dashboard', { user, userName, fullName, image });

};

const friends = async(req, res) => {

    const userName = req.user.userName
    const userId = req.user.id
    const image = req.user.profileImg;

    // getting the list of friends
    const users = await Users.find({ userName: { $ne: userName } }).lean();

   // console.log(friends)
    res.render('user/account-search-friends', { image, userName, users, userId });

}

const profile = async (req, res) => {
    // Passing everything to the view
    const profile = req.user;
   
    const userName = req.user.userName;
    const firstName = req.user.firstName;
    const lastName = req.user.lastName;
    const email = req.user.email
    const phone = req.user.phone;
    const dob = req.user.dob;
    const image = req.user.profileImg;

    res.render('user/account-profile', { profile: profile, userName, firstName, lastName, email, dob, phone, image });
}

const updateProfile = async(req, res) => {

    // get user id
    const userId = req.user._id
    try {

         // check if the user is logged in exist
    const userCheck = await Users.findById(userId).exec();

    if(!userCheck) {
         // render the person the home 400 page
         res.status(400).render('/error/400');  
    }

    // getting the user inputs using post request 
    const { firstName, lastName, email,
            password,dob,phone, c_password
        } = req.body;

    // ensuring all users field is field
    if(!firstName || !lastName || !email || !dob || !phone ) {
        req.flash("error", "Please ensure you fill all fields");
        res.redirect('/users/profile') 
        return;
    }

    // check for unique number
    const phoneNumber = await Users.find({ phone: phone }).count();
    
        if(phoneNumber > 2) {
            req.flash("error", "Sorry, the Number is already registered" );
            res.redirect('/users/profile') 
            return;
        }
    

    // check for unique email
    const countEmail = await Users.find({ email: email }).count();
    
    if(countEmail > 2) {
        req.flash("error", "Sorry, the email is already registered");
        res.redirect('/users/profile')   
        return;
    }

    // check if email is valid or not

    if(password == "" && c_password == "") {
        const updateProfile = await Users.findByIdAndUpdate(
            { _id: req.user._id }, 
               { $set: {
                firstName:firstName,
                lastName:lastName,
                phone:phone,
                email:email,
                dob:dob
                }
            });

        if(updateProfile) {
            // Insert into the database
            req.flash("update_info", "Your Profile has been updated Successfully");
            res.redirect(`/users/profile`)
            return;
        }
    } else {

        // checking if the passwords are equal
        if(password !== c_password) {
            // Insert into the database
            req.flash("error", "Sorry, Your Password do not Match");
            res.redirect('/users/profile')
            return;
        }else {

                // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const updateProfile = await Users.findByIdAndUpdate(
            { _id: req.user._id }, 
               { $set: {
                firstName:firstName,
                lastName:lastName,
                email:email,
                password: hashPassword,
                dob:dob,phone:phone
                }
            });

        if(updateProfile) {
            // Insert into the database
            req.flash("update_info", "Your Profile has been updated Successfully");
            res.redirect('/users/profile')
            return;
        }

        }
    }

    }catch(error) {
         // rendering them to 500
         console.log(error);
         res.status(500).render('/error/500');
    }

}

const profileImage = (req, res) => {

    upload(req, res, async (err) => {
        if(err) {
            console.log(err);
            req.flash("error", err);
            res.redirect('/users/profile')
            return;
        } else {
            // console.log(req.file);
        if(req.file == undefined ) {
                req.flash("error", "Sorry, No file Selected");
                res.redirect('/users/profile');
                return;
        } else {
            
            // Updating the profile image in database
            const profileImage = await Users.findByIdAndUpdate({ _id: req.user.id }, { $set: { "profileImg": req.file.filename } }, { 'profileImg': {$exists: false}, multi: true });

            if(profileImage) {
                
                req.flash("success_msg", "Profile Picture Successfully Updated");
                res.redirect('/users/profile')
                
            }

          }
        }
    });

}

// Exporting the modules
module.exports = {
    signInPage,
    signUpPage,
    resetPasswordPage,
    signUpFunction,
    signInFunction,
    resetPasswordFunction,
    logoutFunciton,
    dashboard,
    friends,
    profile,
    updateProfile,
    profileImage
  }