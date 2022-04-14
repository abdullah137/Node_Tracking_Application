const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Importing the users table
const Users = require('../models/User');
const Friends = require('../models/Friends');
const Notifications = require('../models/Notification');
const User = require('../models/User');

// Multer Configuration
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads/'),
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

const dashboard =  (req, res) => {
    const user = req.user
    console.log(user)
    const userName = req.user.userName
    const image = req.user.profileImg;
    const fullName = req.user.firstName+' '+req.user.lastName
    res.render('user/account-dashboard', { user, userName, fullName, image });
}

const friends =  async (req, res) => {

    const userName = req.user.userName
    const userId = req.user.id

    // getting the list of friends
    const users = await Users.find({ userName: { $ne: userName } }).lean();

   // console.log(friends)
    res.render('user/account-search-friends', { userName, users, userId });
}

const friendRequest =  async (req, res) => {
    
    const loggedUser = req.user.id
    const targetId = req.params.id

    req.body.source_id = loggedUser
    req.body.target_id = targetId

     // check if the param is empty
     if(!targetId) {
        // render them to the page 404
        res.status(404).render('/error/404')
    }
    
    try {

    // check if the user exist
    const userCheck = await Users.findById(targetId).exec();

    // check if the session user is active
    const sessionCheck = await Users.findById(loggedUser).exec();

    if(!userCheck) {
        // render the person to error page
        res.status(400).render('/error/400');   
    }

    if(!sessionCheck) {
        // render the person the error page
        res.status(400).render('/error/400');
    }

    // Inserting the records on the chat request
    const insertFriends = await Friends.create(req.body);

    if(!insertFriends) {
        // render the person home
        res.render('/error/500')

    } else {

    // Updates the list of friends of initiator
    const initiatorList =  await Users.updateOne(
        { _id: req.params.id},
        {
          $push: {
                "friends.0.awaitList": loggedUser
            }
        });

    // Also update the friends list of receiver
    const receiverList = await Users.updateOne(
        { _id: loggedUser }, {
            $push: {
                "friends.0.awaitList": req.params.id
            }
        });

    // saving the notifications    
    const saveNotification = await Notifications.create({ 
        senderId: new mongoose.Types.ObjectId(loggedUser),
        targetId: new mongoose.Types.ObjectId(req.params.id),
        type: 'frd_add'
    });

    // Settting flash messages
    req.flash("friend_msg_success", "Your friend request has been sent successfully");
    res.redirect(`/user/friends`)

    } 
        
    } catch (error) {
        console.log(error);
        res.redirect('/error/500');    
    }

}

const friendAccept = async (req, res) => {
  
    // declaring the needed variables
    const sessionId = req.user.id
    const targetId = req.params.id

    // check if the param is empty
    if(!targetId) {
        // render them to the page 404
        res.status(404).render('/error/404')
    }

    try {
        
        // check if the user exists
        const userCheck = await Users.findById(targetId).exec();

        if(!userCheck) {
            // rendering the error to 404
            res.status(403).render('/error/403')
        }

        // check if the session user exist
        const sessionCheck = await Users.findById(sessionId).exec();

        if(!sessionCheck) {
            // rendering the error to 404
            res.status(400).render('/error/404')
        }

        // Updating the friends records
        const acceptFriendRequest = await Users.updateOne(
            { _id: req.params.id}, {
                $pull: {
                    "friends.0.awaitList": sessionId
                },
                $push: {
                    "friends.0.acceptList": sessionId
                }
            }
        )

        // Updating the friends records
        const acceptFriendRequestReceiver = await Users.updateOne(
            { _id: sessionId }, {
                $pull: {
                    "friends.0.awaitList": targetId
                },
                $push: {
                    "friends.0.acceptList": targetId
                }
            }
        )

            // saving the notifications
            const saveNotification = await Notifications.create( { 
                senderId: new mongoose.Types.ObjectId(sessionId),
                targetId: new mongoose.Types.ObjectId(req.params.id),
                type: 'frd_accept'
            });
        
        // Update the friends status
        const updateFriendStatus = await Friends.updateOne( 
            { $or: [ { source_id: sessionId, target_id: targetId },
                 { source_id: targetId, target_id: sessionId } ] },
                 {
                    $set: {
                        frd_status: "1"
                    }
                 }
         );

        console.log(updateFriendStatus)

        if(!acceptFriendRequest || !acceptFriendRequestReceiver || !saveNotification) {
            // rendering them to 500
            res.status(500).render('/error/500');
        }else {
            
            // Insert into the database
            req.flash("friend_msg_decline", "Your friend request has been declined 😓");
            res.redirect(`/user/friends`)
        }

    } catch (error) {
        console.error(error);
        res.redirect('/error/500');
    }
    
}

const friendDecline = async (req, res) => {

    // declaring the needed variables
    const sessionId = req.user.id
    const targetId = req.params.id

    // check if the param is empty
    if(!targetId) {
        // render them to the page 404
        res.status(404).render('/error/404')
    }

    try {
        
        // check if the user exists
        const userCheck = await Users.findById(targetId).exec();

        if(!userCheck) {
            // rendering the error to 404
            res.status(403).render('/error/403')
        }

        // check if the session user exist
        const sessionCheck = await Users.findById(sessionId).exec();

        if(!sessionCheck) {
            // rendering the error to 404
            res.status(400).render('/error/404')
        }

        // Deleting the friends records
        const deleteFriendRequest = await Users.updateOne(
            { _id: req.params.id },
            {
                $pull: {
                    "friends.0.awaitList": sessionId
                },
                $push: {
                    "friends.0.declineList": sessionId
                }
            }
        );

        // Deleteling friends records
        const deleteFriendRequestReceiver = await Users.updateOne(
            { _id: sessionId }, {
                $pull: {
                    "friends.0.awaitList": req.params.id
                },
                $push: {
                    "friends.0.declineList": req.params.id
                }
            }
        );

          // Update the friends status
          const updateFriendStatus = await Friends.updateOne( 
            { $or: [ { source_id: sessionId, target_id: targetId },
                 { source_id: targetId, target_id: sessionId } ] },
                 {
                    $set: {
                        frd_status: "0"
                    }
                 }
         );

        // saving the notifications
        const saveNotification = await Notifications.create( { 
            senderId: new mongoose.Types.ObjectId(sessionId),
            targetId: new mongoose.Types.ObjectId(req.params.id),
            type: 'frd_reject'
        });


        if(!deleteFriendRequest || !deleteFriendRequestReceiver || !saveNotification || !updateFriendStatus) {
            // rendering them to 500
            res.status(500).render('/error/500');
        }else {
            
            // Insert into the database
            req.flash("friend_msg_decline", "Your friend request has been canceled 😓");
            res.redirect(`/user/friends`)
        }

    } catch (error) {
        console.error(error);
        res.redirect('/error/500');
    }


}

const chatPage = (req, res) => {
    const user_id = req.params.id
    const session_id = req.user.id
    // the room id must been saved in the dastabase
    // and generated from the database
    const room_id = 1000;
    res.render('user/account-chat', { user_id, session_id, room_id });
}

const messageFunction = (req, res) => {
    
    // collecting all request from the database
    const senderId = req.body.sender;
    const clientId = req.body.sendee;
    const text = req.body.message;

    // Checking to see if the 
    if( senderId == "" || clientId == "" || text == "") {
        res.statusCode(400).json({
            msg: "empty",
            status: false
        })
        return;
    } 

    // Check if the sender or the sendee does not exist
    

    // then insert inside the data

    
}

const allFriends = async (req, res) => {
    
    // getting friends list
    const friends = await Users.find({}).lean();
    // get usename
    const userName = req.user.userName
    console.info(friends);
    res.render('user/account-members', { friends });
}

const trackFriends = (req, res) => {
    res.render('user/account-track');
}

const userProfile = (req, res) => {

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

    console.log(req.body);

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
        res.redirect('/user/profile') 
        return;
    }

    // check for unique number
    const phoneNumber = await Users.find({ phone: phone }).count();
    
        if(phoneNumber > 2) {
            req.flash("error", "Sorry, the Number is already registered" );
            res.redirect('/user/profile') 
            return;
        }
    

    // check for unique email
    const countEmail = await Users.find({ email: email }).count();
    
    if(countEmail > 2) {
        req.flash("error", "Sorry, the email is already registered");
        res.redirect('/user/profile')   
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
            res.redirect(`/user/profile`)
            return;
        }
    } else {

        // checking if the passwords are equal
        if(password !== c_password) {
            // Insert into the database
            req.flash("error", "Sorry, Your Password do not Match");
            res.redirect('/user/profile')
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
            res.redirect('/user/profile')
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

const profileImg =  (req, res) => {

     upload(req, res, async (err) => {
        if(err) {
            console.log(err);
            req.flash("error", err);
            res.redirect('/user/profile')
            return;
        } else {
            // console.log(req.file);
        if(req.file == undefined ) {
                req.flash("error", "Sorry, No file Selected");
                res.redirect('/user/profile');
                return;
        } else {
            
            // Updating the profile image in database
            const profileImage = await User.findByIdAndUpdate({ _id: req.user.id }, { $set: { "profileImg": req.file.filename } }, { 'profileImg': {$exists: false}, multi: true });

            if(profileImage) {
                
                req.flash("success_msg", "Profile Picture Successfully Updated");
                res.redirect('/user/profile')
                
            }

          }
        }
    });
}

module.exports = { 
    profileImg,
    updateProfile,
    userProfile,
    trackFriends,
    allFriends,
    messageFunction,
    chatPage,
    friendDecline,
    friendAccept,
    friendRequest,
    friends,
    dashboard
}