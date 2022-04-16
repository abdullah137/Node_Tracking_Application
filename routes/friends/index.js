const express = require('express');
const router = express.Router();

// Importing our controllers for these
const { friends, accept, requests, decline } = require('../../controllers/friends/index')

// Ensuring the routes are protected
const { ensureAuthenticated, forwardAuthenticated }  = require("../../middleware/auth");

router.get('/', friends);

router.get('/request/:id', requests);

router.get('/decline/:id', decline)

router.get('/accept/:id', accept);

module.exports = router;