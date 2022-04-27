const mongoose = require('mongoose');

// importing the database model
const Users = require('../../models/User');
const Friends = require('../../models/Friends');
const Notifications = require('../../models/Notification');

const friends = async (req, res) => {

    const userName = req.user.userName
    const userId = req.user.id
    const image = req.user.profileImg;

    // getting the list of friends
    const users = await Users.find({ userName: { $ne: userName } }).lean();

   // console.log(friends)
    res.render('user/account-search-friends', { image, userName, users, userId });
}

const requests = async (req, res) => {
    

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
    res.redirect(`/users/friends`)

    } 
        
    } catch (error) {
        console.log(error);
        res.redirect('/error/500');    
    }

};

const decline = async(req, res) => {

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
            res.redirect(`/users/friends`)
        }

    } catch (error) {
        console.error(error);
        res.redirect('/error/500');
    }

};

const accept = async(req, res) => {

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
            res.redirect(`/users/friends`)
        }

    } catch (error) {
        console.error(error);
        res.redirect('/error/500');
    }

}

const search = async(req, res) => {
    
    // check if the user is logged in

    // check if the user log in is validated

    // get the body from input
    const { terms } = req.body;
  
    // check if the input is empty
    if(!terms) {
        req.flash("friend_msg_decline", "Oops!!! the search filed should not be empty 😓");
        res.redirect(`/users/friends`)
        return;
    }

    // check if the search user exist
    const users = await Users.find({ $or: [ { "userName": /abdul/ }, { "firstName": /abdullah/ }, { "lastName": /no/ }  ] }).lean();

    const userName = req.user.userName
    const userId = req.user.id
    const image = req.user.profileImg;

    const success = { msg: "Your Result is here" };
    res.render('user/account-search-friends', {image, userName, users, userId, success});
}

module.exports = { friends, accept, requests, decline, search }