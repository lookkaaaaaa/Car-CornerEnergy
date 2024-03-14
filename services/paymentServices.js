// paymentServices.js

const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../Middleware/ApiError');
const jwt = require('jsonwebtoken');

// Services function for choosing payment method
exports.choosePaymentMethod = asyncHandler(async (req, res, next) => {
    const { paymentMethod } = req.body;
    const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Decode token to get user ID

    if (!paymentMethod || (paymentMethod !== 'visa' && paymentMethod !== 'cash')) {
        return next(new ApiError('Invalid payment method', StatusCodes.BAD_REQUEST));
    }

    // Assuming you have access to your database here, you can update the user's document with the chosen payment method
    // For example:
    // const userId = decoded.userId;
    // await User.findByIdAndUpdate(userId, { $set: { paymentMethod: paymentMethod } });

    res.status(StatusCodes.OK).json({ message: 'Payment method chosen successfully', paymentMethod, userId: decoded.userId });
});
