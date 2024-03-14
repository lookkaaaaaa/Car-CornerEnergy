// paymentRoute.js

const express = require('express');
const router = express.Router();
const paymentServices = require('../services/paymentServices');
const { protect } = require('../services/authServices'); // Import your protect middleware

// Route for user to choose payment method
router.post('/choose', protect, paymentServices.choosePaymentMethod);

module.exports = router;
