const express = require('express');
const router = express.Router();

const {
  signupValidator,
  loginValidator,
} = require('../validators/authValidator');

const {
  signup,
  login,
  //forgotPassword,
  //verifyPassResetCode,
  //resetPassword,
} = require('../services/authServices');

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
// router.post('/forgotPassword', forgotPassword);
// router.post('/verifyResetCode', verifyPassResetCode);
// router.put('/resetPassword', resetPassword);

module.exports = router;