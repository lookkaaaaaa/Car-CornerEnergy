const { check, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel'); 

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.signupValidator = [
  check('name')
    .notEmpty().withMessage(' name is required')
    .isLength({ min: 3 }).withMessage('Too short User name'),

  check('email')
    .notEmpty().withMessage('Email required')
    .isEmail().withMessage('Invalid email address')
    .custom(async (val) => {
      
    }),

  check('password')
    .notEmpty().withMessage('Password required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty().withMessage('Password confirmation required'),

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG']).withMessage('Invalid Number'),

  validatorMiddleware,
];

exports.loginValidator = [
  check('email')
    .notEmpty().withMessage('Email required')
    .isEmail().withMessage('Invalid email address'),

  check('password')
    .notEmpty().withMessage('Password required')
    .isLength({ min: 8}).withMessage('Password must be at least 8 characters'),

  validatorMiddleware,
];
