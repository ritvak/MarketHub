const express = require('express');
const authMiddleware = require('../Middleware/authMiddleware');
const { createCheckoutSession, stripeWebhook } = require('../Controllers/stripeController');

const router = express.Router();

router.post('/create-checkout-session', authMiddleware, createCheckoutSession);

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
