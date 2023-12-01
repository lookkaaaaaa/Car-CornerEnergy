const express = require('express');
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

const router = express.Router();

// Define route handlers
router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
// Uncomment routes once they are implemented
// router.post('/forgotPassword', forgotPassword);
// router.post('/verifyResetCode', verifyPassResetCode);
// router.put('/resetPassword', resetPassword);

module.exports = router;
