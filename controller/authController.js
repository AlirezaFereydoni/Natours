const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/createResponse');

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createResponse(res, 201, newUser);
});

module.exports = {
  signup,
};
