const express = require('express');
const router = express.Router();

// Importing our controllers
const { chat, privateChat, _sendPrivateMessage, _getPrivateMessage } = require('../../controllers/message/index');

// Ensuring the routes are protected
const { ensureAuthenticated, forwardAuthenticated} = require('../../middleware/auth');

router.get('/', chat);

router.get('/:id', privateChat)

router.post('/private/send', _sendPrivateMessage);

router.get('/private/get/:id', _getPrivateMessage)

module.exports = router;