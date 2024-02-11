const { check } = require('express-validator');
const validatorMiddleware = require('../Middleware/validatorMiddleware');
const User = require('../models/userModel');

exports.signupValidator = [
  check('name')
    .notEmpty().withMessage('User required'),

  check('email')
    .notEmpty().withMessage('Email required')
    .isEmail().withMessage('Invalid email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),

  check('password')
    .notEmpty().withMessage('Password required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
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
    .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

    check('carType')
    .notEmpty().withMessage('carType required'),

    check('role').optional(),

  validatorMiddleware,                       // To catch Error
];

exports.loginValidator = [
  check('email')
    .notEmpty().withMessage('Email required')
    .isEmail().withMessage('Invalid email address'),

  check('password')
    .notEmpty().withMessage('Password required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  validatorMiddleware,
];