const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/createResponse');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  createResponse(res, 200, users);
});

// Get Specific User
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

// Create User
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

// Update User
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

// Delete User
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};
