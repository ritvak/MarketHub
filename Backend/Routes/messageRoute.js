const express = require('express');
const { createMessage, getMessages } = require('../Controllers/messageController');

const router = express.Router();

router.post('/sendMessage', createMessage);
router.post('/getMessages', getMessages);

module.exports = router;
