//const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const asyncHandler = require('express-async-handler');
const ApiError = require('../Middleware/ApiError');
//const sendEmail = require('../utils/sendEmail');
const User = require('../models/userModel');

// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    carType: req.body.carType,
    role: req.body.role,
  });

  // 2- Generate token
  const token = jwt.sign({userId : user._id} ,  process.env.JWT_SECRET_KEY, {expiresIn : process.env.JWT_EXPIRE_TIME,}
    );
  // 4) send response to client side
  res.status(201).json({ data : user, token });
});

// @desc    Login
// @route   GET /api/v1/auth/login
  exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (authValidation)
  // 2) check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Incorrect email or password', 401));
  }
  // 3) generate token
  const token = jwt.sign({userId : user._id} ,  process.env.JWT_SECRET_KEY, {expiresIn : process.env.JWT_EXPIRE_TIME,}
    );
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});



// @desc   make sure the user is logged in 
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization /*&&  req.headers.authorization.startsWith('Bearer')*/) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new ApiError('You are not login, Please login to get access this route',401)
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError('The user that belong to this token does no longer exist',401)
    );
  }
  req.user = currentUser;
  next();
});


//  Authorization (User Permissions)
// ["admin", "manager"]
exports.allowedTo = (...roles) =>                        //...roles ==> array
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403)
      );
    }
    next();
  });