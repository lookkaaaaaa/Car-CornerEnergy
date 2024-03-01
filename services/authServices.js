const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const ApiError = require('../Middleware/ApiError');
const User = require('../models/userModel');

// Signup
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

// Middleware to protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError('You are not logged in. Please log in to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const currentUser = await User.findById(decoded.userId);

    if (!currentUser) {
      return next(new ApiError('The user belonging to this token does not exist', 401));
    }

    req.user = currentUser;
    next();
  } catch (error) {
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

// Function to generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME
  });
}
