const express = require('express');
const passport = require("passport");
const authMiddleware = require('../Middleware/authMiddleware');
const { registerUser, loginUser, getUserDetails, getAllUsers, forgotPassword, changePasswordGet, changePasswordPost, updateProfileImage, updateProfileDetails, deleteUser, changePassword } = require('../Controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getUserDetails);
router.get('/', authMiddleware, getAllUsers);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:id/:token', changePasswordGet)
router.post('/reset-password/:id/:token', changePasswordPost);
router.get('/facebook', passport.authenticate('facebook', ["profile","email"]));
router.get("/facebook/callback", passport.authenticate("facebook", {
    successRedirect: `${process.env.FRONTEND_URL}/products`,
    failureRedirect: "/login",
  }));
router.patch('/my-profile/edit-profile/upload-Image', updateProfileImage);
router.patch('/my-profile/edit-profile/update-Details', updateProfileDetails);
router.delete('/my-profile/edit-profile/:id', deleteUser);
router.patch('/my-profile/edit-profile/change-password/:id', changePassword);
  

module.exports = router;