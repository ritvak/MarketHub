const express = require('express');
const { createChat, getUserChats, findChat } = require('../Controllers/chatController');

const router = express.Router();

router.post('/', createChat);
router.get('/getAllChats', getUserChats);
router.get('/find/:secondId', findChat);

module.exports = router;
