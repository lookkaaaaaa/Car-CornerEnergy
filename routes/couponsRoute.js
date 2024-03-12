const express = require('express');
const router = express.Router();

const {
  getCoupon,
  getCoupons,
  createcoupon,
  updateCoupon,
  deleteCoupon,
} = require('../services/couponService');

const authService = require('../services/authServices');
//1. authService.protect===> elly hy3ml create lazm ykon logged in 
//2. authService.allowedTo('admin', 'manager')   ===> lazm Admin 
//Admin only
router.route('/').post(authService.protect, authService.allowedTo('admin', 'manager') ,createcoupon); 
router.route('/').get(authService.protect, authService.allowedTo('admin', 'manager') ,getCoupons);
router.route('/:name').get(authService.protect, authService.allowedTo('admin', 'manager') ,getCoupon);
router.route('/:id').put(authService.protect, authService.allowedTo('admin', 'manager') ,updateCoupon).delete(deleteCoupon);

module.exports = router;