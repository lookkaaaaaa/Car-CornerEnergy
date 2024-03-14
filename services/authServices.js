const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const ApiError = require('../Middleware/ApiError');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto'); // Move the crypto module import here

// Function to generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME
  });
}

// @desc    Signup
// @route   POST /api/v1/auth/signup
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, carType, role } = req.body;

  const user = await User.create({ name, email, password, phone, carType, role });

  const token = generateToken(user._id);

  res.status(201).json({ data: user, token });
});

// Login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError('Incorrect email or password', 401));
  }

  const token = generateToken(user._id);

  res.status(200).json({ data: user, token });
});

//protect Handler
// @desc   make sure the user is logged in 
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract the token from the Authorization header
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token is missing or improperly formatted
  if (!token) {
    return next(new ApiError('You are not logged in. Please log in to access this route', 401));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find the current user based on the user ID in the token
    const currentUser = await User.findById(decoded.userId);

    // Check if user exists
    if (!currentUser) {
      return next(new ApiError('The user belonging to this token does not exist', 401));
    }

    // Attach the user object to the request for further processing
    req.user = currentUser;
    next();
  } catch (error) {
    // Handle invalid or expired tokens
    return next(new ApiError('Invalid token. Please log in again', 401));
  }
});

// Authorization middleware
exports.allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError('You are not authorized to access this route', 403));
    }
    next();
  };
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`There is no user with that email ${req.body.email}`, 404));
  }

  // 2) If user exists, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // Return success response before attempting to send email
  res.status(200).json({ status: 'Success', message: 'Reset code sent to email' });

  // 3) Send the reset code via email <sendEmail>
  const message = `Hi ${user.name},\n We received a request to reset the password on your CCE Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The CCE Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {
    // If there's an error sending the email, handle it here
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError('There is an error in sending email', 500));
  }
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // Ensure resetCode is provided in the request body
  if (!req.body.resetCode) {
    return next(new ApiError('Reset code is required', 400));
  }

  // Generate hashed reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  try {
    // Find user with matching hashed reset code and valid expiration time
    const user = await User.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });

    // If no user found with the provided reset code or expired reset code
    if (!user) {
      return next(new ApiError('Reset code invalid or expired', 400));
    }

    // Mark the reset code as verified
    user.passwordResetVerified = true;
    await user.save();

    // Send success response
    res.status(200).json({ status: 'Success' });
  } catch (error) {
    // Handle any unexpected errors
    return next(new ApiError('Failed to verify reset code', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetPassword
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`There is no user with email ${req.body.email}`, 404));
  }

  // 2) Check if reset code verified [true or false]
  if (!user.passwordResetVerified) {
    return next(new ApiError('Reset code not verified', 400));
  }

  user.password = req.body.newPassword;  //from body
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate new token
  const token = generateToken(user._id);
  res.status(200).json({ token });
});
