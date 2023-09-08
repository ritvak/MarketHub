const express = require('express');
const { getOrders } = require('../Controllers/orderController');

const router = express.Router();

router.post('/', getOrders);

module.exports = router;
