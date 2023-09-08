const express = require('express');
const { SetContactDetails } = require('../Controllers/contactUsController');

const router = express.Router();

router.post('/', SetContactDetails);

module.exports = router;
