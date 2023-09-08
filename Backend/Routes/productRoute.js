const express = require('express');
const { createProduct, getALlProducts,getOneProduct, getUserProducts, suggestion, sorting, deleteProduct, updateProduct } = require('../Controllers/productController');

const router = express.Router();

router.post('/', getALlProducts);
router.post('/addProduct', createProduct);
router.post('/getone', getOneProduct);
router.post('/my-products', getUserProducts);
router.post('/suggestion', suggestion);
router.post('/sorting', sorting);
router.delete('/deleteProduct/:id', deleteProduct);
router.patch('/update-product', updateProduct);

module.exports = router;
