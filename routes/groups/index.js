const express = require('express');
const router = express.Router();

// importing our controllers
const { groups, add } = require('../../controllers/groups/index');

router.get('/', groups);

router.post('/add', add)

module.exports = router;