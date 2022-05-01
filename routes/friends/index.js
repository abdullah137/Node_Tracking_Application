const express = require('express');
const router = express.Router();

// Importing our controllers for these
const { friends, accept, requests, remove, search, cancel } = require('../../controllers/friends/index')

// Ensuring the routes are protected
const { ensureAuthenticated, forwardAuthenticated }  = require("../../middleware/auth");

router.get('/', friends);

router.get('/request/:id', requests);

router.get('/decline/:id', remove)

router.get('/accept/:id', accept);

router.post('/', search);

router.get('/cancel/:id', cancel);

module.exports = router;