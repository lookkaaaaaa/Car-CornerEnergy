const bcrypt = require('bcryptjs');    //for incrybt password
const { check, body } = require('express-validator');
const validatorMiddleware = require('../Middleware/validatorMiddleware');
const User = require("../models/userModel");

exports.createUserValidator = [

    check('name')
    .notEmpty().withMessage('User required'),

    check('email')
    .notEmpty().withMessage('Email required')
    .isEmail().withMessage('Invalid email address')
    .custom((val) =>
    user.findOne({ email: val }).then((user) => {
        if (user) {
        return Promise.reject(new Error('E-mail already in user'));
        }
    })
    ),

    check('password')
    .notEmpty().withMessage('Password required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .custom((password, { req }) => {
    if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');               //Password Confirmation
    }
    return true;
    }),

    //Password Confirmation is required**
    check('passwordConfirm')
    .notEmpty().withMessage('Password confirmation required'),

    check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

    check('carType')
    .notEmpty().withMessage('carType required'),

    check('role').optional(),

    validatorMiddleware,                         // To catch Errors
];

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
];

exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    body('name')
    .optional()
    .custom((val, { req }) => {
    return true;
    }),

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

    check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

    check('carType')
    .notEmpty().withMessage('carType required'),

    check('role').optional(),
    validatorMiddleware,
];

exports.changeUserPasswordValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),

    check('currentPassword')
    .notEmpty().withMessage('You must enter your current password'),

    check('passwordConfirm')
    .notEmpty().withMessage('You must enter the password confirm'),

    check('password')
    .notEmpty().withMessage('You must enter new password')
    .custom(async (val, { req }) => {
        // 1) Verify current password
        const user = await User.findById(req.params.id);
        if (!user) {
        throw new Error('There is no user for this id');
        }
        const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
        );
        if (!isCorrectPassword) {
            throw new Error('Incorrect current password');
        }
        // 2) Verify password confirm
        if (val !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
        }
        return true;
    }),
    validatorMiddleware,
    ];

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
];