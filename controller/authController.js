const JWT = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/createResponse');
const errorHandler = require('../utils/errorHandler');

const createToken = (id) =>
  JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = createToken(newUser._id);

  createResponse(res, 201, { newUser, token });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return errorHandler(400, 'Provide email and password');

  const user = await User.findOne({ email }).select('+password');
  console.log({ password, userPass: user.password });
  if (!user || !(await user.isPasswordCorrect(password, user.password)))
    return errorHandler(401, 'Your email or password is Invalid');

  const token = createToken(user._id);

  createResponse(res, 200, token);
});

module.exports = {
  signup,
  login,
};
