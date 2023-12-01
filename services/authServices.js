const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

exports.signup = asyncHandler(async (req, res, next) => {
  // Extract user information from the request body
  const { name, email, password } = req.body;

  // Validate user input (you may want to add more validation logic)
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email already exists.' });
  }

  // Create a new user
  const newUser = new User({ name, email, password });
  await newUser.save();

  // Send a success response
  res.status(201).json({ message: 'User registered successfully.' });
});

exports.login = asyncHandler(async (req, res, next) => {
  // Extract user credentials from the request body
  const { email, password } = req.body;

  // Validate user input (you may want to add more validation logic)
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // Check if the password is correct
  const isPasswordValid = await (password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // Generate a token or set up a session (depending on your authentication strategy)

  // Send a success response
  res.status(200).json({ message: 'Login successful.' });
});
