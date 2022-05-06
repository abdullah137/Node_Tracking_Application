const mongoose = require('mongoose');

// Importing our models
const Users = require('../../models/User');
const Rooms = require('../../models/Room');
const objectId = require('mongoose').Types.ObjectId;
const Messages = require('../../models/Messages');


const chat = async (req, res) => {

    const userName = req.user.userName
    const userId = req.user.id
    const image = req.user.profileImg;

    try {
      
      // getting user information
      const users = await Users.findOne({ _id: userId });
      
      const length = users.friends[0];
      console.log(users.friends[0])
      if(length) {
        
        const waitList = users.friends[0].awaitList;
        const acceptList = users.friends[0].acceptList;
        const declineList = users.friends[0].declineList;
  
      } else {

          const waitList = []
          const acceptList = []
          const declineList = []
      }

      // get all friends 
      const _friends = await Users.find({ $or:  [ {_id: acceptList }, {_id: waitList }, {_id: declineList } ] }).lean();
      res.render('user/account-chat', { image, userName, users, _friends, userId })

      
    }catch(error) {
        console.log(error)
        res.redirect('/error/500')
    }
   
}

const privateChat = async (req, res) => {

    const userName = req.user.userName
    const userId = req.user.id
    const image = req.user.profileImg;

    // getting the users info for chat
    const _u1 = userId
    const _u2 = req.params.id
    
    try{
      
      // getting room id 
      const room = await Rooms.findOne({ $or: [ { rList: [ _u1, _u2 ] }, { rList: [ _u2, _u1 ] }  ] }).select('rId');
       const _rId = (room.rId)
       
          // getting user information
          const users = await Users.findOne({ _id: userId });

          // getting second user info
          const _users2 = await Users.findOne({ _id: _u2 });

          // user Img 
          const _uImg = _users2.profileImg

         const waitList = users.friends[0].awaitList;
         const acceptList = users.friends[0].acceptList;
         const declineList = users.friends[0].declineList;

          // get all friends 
          const _friends = await Users.find({ $or:  [ {_id: acceptList }, {_id: waitList }, {_id: declineList } ] }).lean();
          
          res.render('user/account-chat', { image, userName, users, _friends, userId, _u1, _u2, _rId, _uImg })
    }catch(error) {
      console.log(error)
      res.status(500).redirect('/error/500')
    }

}

const _sendPrivateMessage =  async(req, res) => {

  // desconstructing the request body
  const { room, sender, sendee, message} = req.body
    console.log(req.body)
  if(!room || !sender || !sendee || !message) {

    res.status(400).json({
      msg: "FIELDS_EMPTY",
      status: false
    });
    return;

  }

  try {

    // checking if objectId is valid
    if(!objectId.isValid(sender)) {
       // rendering the error to 404
       res.status(404).json({
        msg: "BAD_REQUEST",
        status: false,
      });
      return;
    }

     // checking if the sessionId exist
     const _u = await Users.findById(sender);

     if(!_u) {
       // rendering the error to 404
        res.status(404).json({
          msg: "USER_NOT_FOUND",
          status: false
          });
        return;
     }

     // checking if the room id exist
      const _r = await Rooms.find({ rId: room });
      if(!_r) {
          // rendering the error to 404
          res.status(404).json({
            msg: "ROOM_NOT_FOUND",
            status: false
          });
          return;
      }

        // checking if objectId is valid
      if(!objectId.isValid(sendee)) {
          // rendering the error to 400
           res.status(400).json({
            msg: "BAD_REQUEST",
            status: false,
           });
          return;

      }

     // checking for the sendee
     const _t = await Users.findById(sendee);
     if(!_t) {
        // rendering the error to 404
          res.status(404).json({
            msg: "USER_NOT_FOUND",
            status: false
          });
          return;
      }

        // check if the target id is okay
      const targetId = req.params.id

      // constructing the request body
      const object = { 
        roomId:room,
        senderId: new mongoose.Types.ObjectId(sender),
        sendeeId: new mongoose.Types.ObjectId(sendee),
        messageText: message
      }

      // inserting the message right now
      const _m = await Messages.create(object);

      if(_m) {
          // rendering the error to 200
          res.status(200).json({
            status: true,
            msg: "success"
          });
          return;

      }else  {
          // rendering the error to 500
          res.status(500).json({
            error: "INTERNAL_ERROR",
            status: false,
            message: "Sorry, please do things properly"
          });
          return;
      }
  }catch(error) {
      console.error(error);
         // rendering the error to 500
         res.status(500).json({
          msg: "INTERNAL_ERROR",
          status: false,
          message: "Shine, your eye and resolve"
        });
        return;
    }
  }

const _getPrivateMessage  =  async(req, res) => {
    
    // getting room id from the params
    const _rId = req.params.id

    // check if the room id exist
    try {
        const _rCheck = await Rooms.find({ rId: _rId });

        if(!_rCheck) {
            res.status(400).json({
              msg: "BAD_REQUEST",
              status: false
            });
            return;
        }

        // getting chats
        const _chats = await Messages.find({ roomId: _rId });

        if(_chats) {
          res.status(200).json({
            msg: 'SUCCESS',
            data: _chats
          });
          return;
        }
       

    }catch(error) {
        console.log(error)
        res.status(500).json({
          msg: "INTERNAL_ERROR",
          status: false
        })
    }
}

module.exports = { chat, privateChat, _sendPrivateMessage, _getPrivateMessage }