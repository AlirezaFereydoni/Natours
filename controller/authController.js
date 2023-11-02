const { promisify } = require('util');
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

  if (!user || !(await user.isPasswordCorrect(password, user.password)))
    return errorHandler(401, 'Your email or password is Invalid');

  const token = createToken(user._id);

  createResponse(res, 200, token);
});

const protected = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer'))
    return next(errorHandler(401, 'You are not authorized'));

  const token = authorization.split(' ')[1];

  const decoded = JWT.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user)
    return next(errorHandler(401, 'Your token is Invalid, Please login again'));

  if (!token || !decoded)
    return next(errorHandler(401, 'You are not authorized'));

  next();
});

module.exports = {
  signup,
  login,
  protected,
};
