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
router.route('/').post(authService.protect, authService.allowedTo('admin', 'manager') ,createcoupon); //Admin

router.route('/').get(getCoupons);
router.route('/:name').get(getCoupon);
router.route('/:id').put(updateCoupon).delete(deleteCoupon);

module.exports = router;