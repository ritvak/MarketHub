const express = require('express');
// const { createProduct, getALlProducts } = require('../Controllers/productController');
const { setLike } = require('../Controllers/likesController');

const router = express.Router();

// router.post('/', getALlLikes);
router.post('/like', setLike);

// router.post('/addProduct', createProduct);

module.exports = router;
