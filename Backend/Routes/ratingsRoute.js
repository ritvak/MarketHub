const express = require('express');
// const { createProduct, getALlProducts } = require('../Controllers/productController');
const { setRating,getRating } = require('../Controllers/ratingsController');

const router = express.Router();

// router.post('/', getALlLikes);
router.post('/rating', setRating);
router.post('/', getRating);

// router.post('/addProduct', createProduct);

module.exports = router;
