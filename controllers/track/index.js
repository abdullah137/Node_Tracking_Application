const mongoose = require('mongoose');

// Importing the models required
const Users = require('../../models/User');
const geoLocation = require('../../models/Geolocation');

const index = async (req, res) => {
    res.render('user/account-track')
}

module.exports = { index }