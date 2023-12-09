const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/createResponse');
const { updateOne, deleteOne } = require('./factoryHandler');

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  createResponse(res, 200, users);
});

const updateMe = catchAsync(async (req, res, next) => {
  const { email, name } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      email,
      name,
    },
    { new: true, runValidators: true },
  );

  createResponse(res, 200, updatedUser);
});

const deActiveMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  createResponse(res, 200, 'Successfully deactivated');
});

const updateUser = updateOne(User);
const deleteUser = deleteOne(User);

module.exports = {
  getAllUsers,
  updateMe,
  deActiveMe,
  updateUser,
  deleteUser,
};
