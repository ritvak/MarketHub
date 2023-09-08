const express = require('express');
const { loginAdmin, updatePassword,resetPassword,forgotPassword } = require('../Controllers/adminloginController');

const router = express.Router();

router.post('/adminLogin', loginAdmin);
router.post('/changePassword', updatePassword);
router.post('/forgotPassword',forgotPassword);
router.post('/resetPassword', resetPassword);

module.exports = router;
