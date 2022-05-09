const express = require('express');
const router = express.Router();

// Importing the controllers for it
const { index } = require('../../controllers/track/index')

// Ensuring the routes are protected
const { ensureAuthenticated, forwardAuthenticated} = require('../../middleware/auth');


router.get('/', index)

module.exports = router;