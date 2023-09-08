const express = require('express');
const { createComment ,getCommentsByPost} = require('../Controllers/commentController');

const router = express.Router();

router.post('/create', createComment);
router.post('/', getCommentsByPost);
// getCommentsByPost
module.exports = router;
