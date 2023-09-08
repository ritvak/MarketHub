const express = require('express');
const { getAllUsers, blockUser, unblockUser } = require('../Controllers/adminController');

const router = express.Router();

router.get('/getUser', getAllUsers);
router.put('/blockUser/:id', blockUser);
router.put('/unblockUser/:id', unblockUser);

module.exports = router;
