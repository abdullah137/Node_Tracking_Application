// Importing our models
const Users = require('../../models/User');

const groups = async (req, res) => {

    const userName = req.user.userName
    const userId = req.user.id
    const image = req.user.profileImg;

    // getting the list of friends
    const users = await Users.find({ userName: { $ne: userName } }).lean();

    res.render('user/account-group', { image, userName, users, userId })
}

const add = (req, res) => {
   
    const body = req.body;
   // removing all object properties
   //    const removeBody = Object.getOwnPropertyNames(body) 

   console.log(body);
   

}


module.exports = { groups, add }