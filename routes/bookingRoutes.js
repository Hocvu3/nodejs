const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.get('/checkout-session/:tourId',bookingController.checkoutSession);

module.exports = router