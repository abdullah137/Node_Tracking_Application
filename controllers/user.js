const mongoose = require('mongoose');

// Importing the users table
const Users = require('../models/User');
const Friends = require('../models/Friends');
const Notifications = require('../models/Notification');

const dashboard =  (req, res) => {
    const user = req.user
    console.log(user)
    const userName = req.user.userName
    const fullName = req.user.firstName+' '+req.user.lastName
    res.render('user/account-dashboard', { user, userName, fullName });
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
        res.sendStatus(404).render('/error/404')
    }
    
    try {

    // check if the user exist
    const userCheck = await Users.findById(targetId).exec();

    // check if the session user is active
    const sessionCheck = await Users.findById(loggedUser).exec();

    if(!userCheck) {
        // render the person the home 500 page
        res.sendStatus(502).render('/error/502');   
    }

    if(!sessionCheck) {
        // render the person the home page
        res.sendStatus(502).render('/error/502');
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
        res.sendStatus(404).render('/error/404')
    }

    try {
        
        // check if the user exists
        const userCheck = await Users.findById(targetId).exec();

        if(!userCheck) {
            // rendering the error to 404
            res.sendStatus(403).render('/error/403')
        }

        // check if the session user exist
        const sessionCheck = await Users.findById(sessionId).exec();

        if(!sessionCheck) {
            // rendering the error to 404
            res.sendStatus(400).render('/error/404')
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
                type: 'frd_reject'
            });



        if(!acceptFriendRequest || !acceptFriendRequestReceiver || !saveNotification) {
            // rendering them to 500
            res.sendStatus(500).render('/error/500');
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
        res.sendStatus(404).render('/error/404')
    }

    try {
        
        // check if the user exists
        const userCheck = await Users.findById(targetId).exec();

        if(!userCheck) {
            // rendering the error to 404
            res.sendStatus(403).render('/error/403')
        }

        // check if the session user exist
        const sessionCheck = await Users.findById(sessionId).exec();

        if(!sessionCheck) {
            // rendering the error to 404
            res.sendStatus(400).render('/error/404')
        }

        // Deleting the friends records
        const deleteFriendRequest = await Users.updateOne(
            { _id: req.params.id },
            {
                $pull: {
                    "friends.0.awaitList": sessionId
                }
            }
        );

        // Deleteling friends records
        const deleteFriendRequestReceiver = await Users.updateOne(
            { _id: sessionId }, {
                $pull: {
                    "friends.0.awaitList": req.params.id
                }
            }
        );

        // saving the notifications
        const saveNotification = await Notifications.create( { 
            senderId: new mongoose.Types.ObjectId(sessionId),
            targetId: new mongoose.Types.ObjectId(req.params.id),
            type: 'frd_reject'
        });


        if(!deleteFriendRequest || !deleteFriendRequestReceiver || !saveNotification) {
            // rendering them to 500
            res.sendStatus(500).render('/error/500');
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
    res.render('user/account-profile');
}

module.exports = { 
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