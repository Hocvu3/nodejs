const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

router.get('/',bookingController.createBookingCheckout,authController.isLoggedIn,viewController.getOverview);
router.get('/tour/:slug',authController.isLoggedIn,viewController.getTour);
router.get('/login',authController.isLoggedIn,viewController.getLoginForm);
router.get('/me',authController.protect,viewController.getAccount);
module.exports = router