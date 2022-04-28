// Importing our models
const Users = require('../../models/User');
const Rooms = require('../../models/Room');

const chat = async (req, res) => {

    const userName = req.user.userName
    const userId = req.user.id
    const image = req.user.profileImg;

    // getting user information
   const users = await Users.findOne({ _id: userId });

   const waitList = users.friends[0].awaitList;
   const acceptList = users.friends[0].acceptList;
   const declineList = users.friends[0].declineList;

   // get all friends 
   const _friends = await Users.find({ $or:  [ {_id: acceptList }, {_id: waitList }, {_id: declineList } ] }).lean();

  res.render('user/account-chat', { image, userName, users, _friends, userId })
}

const privateChat = async (req, res) => {

    const userName = req.user.userName
    const userId = req.user.id
    const image = req.user.profileImg;

    // getting the users info for chat
    const _u1 = userId
    const _u2 = req.params.id

    // getting room id 
    const room = await Rooms.findOne({ rList: { $in: [ _u1, _u2 ] } }, { rType: 'Private' }).select('rId');
    const _rId = (room.rId)

    // getting user information
    const users = await Users.findOne({ _id: userId });

   const waitList = users.friends[0].awaitList;
   const acceptList = users.friends[0].acceptList;
   const declineList = users.friends[0].declineList;

   // get all friends 
   const _friends = await Users.find({ $or:  [ {_id: acceptList }, {_id: waitList }, {_id: declineList } ] }).lean();

  res.render('user/account-chat', { image, userName, users, _friends, userId, _u1, _u2, _rId })

}

module.exports = { chat, privateChat }