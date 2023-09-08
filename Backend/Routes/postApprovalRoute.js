const express = require('express');
const {
  getAllProducts,
  approveProduct,
  rejectProduct,
} = require('../Controllers/postApprovalController');

const router = express.Router();

router.get('/getProducts', getAllProducts);
router.put('/approveProduct/:id', approveProduct);
router.put('/rejectProduct/:id', rejectProduct);

module.exports = router;
