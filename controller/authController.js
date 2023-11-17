const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/createResponse');
const errorHandler = require('../utils/errorHandler');
const emailSender = require('../utils/email');

const createToken = (id) =>
  JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

const setTokenCookie = (id, res) => {
  const token = createToken(id);
  const cookieOption = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
  };

  res.cookie('jwt', token, cookieOption);

  return token;
};

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  const token = setTokenCookie(newUser._id, res);

  createResponse(res, 201, { newUser, token });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return errorHandler(400, 'Provide email and password');

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password)))
    return errorHandler(401, 'Your email or password is Invalid');

  const token = setTokenCookie(user._id, res);

  createResponse(res, 200, token);
});

const protected = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer'))
    return next(errorHandler(401, 'You are not authorized'));

  const token = authorization.split(' ')[1];

  const decoded = JWT.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(errorHandler(401, 'Your token is Invalid, Please login again'));

  if (!token || !decoded)
    return next(errorHandler(401, 'You are not authorized'));

  req.user = currentUser;
  next();
});

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        errorHandler(403, 'This user does not have permission to this action'),
      );

    next();
  };

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(errorHandler(404, 'This user does not find'));

  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Reset your password by clicking on this url: \n ${resetURL} \n if you don't want to reset password please ignore this email.`;

  try {
    await emailSender({
      email: user.email,
      subject: 'Reset Password URL',
      message: message,
    });

    createResponse(res, 200, 'Your reset password link sent to your email');
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });
    next(errorHandler(500, 'There was an error to sending email'));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) return next(errorHandler(403, 'Your link has expired or Invalid'));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  const token = createToken(user._id);
  createResponse(res, 200, token);
});

const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.isPasswordCorrect(currentPassword, user.password)))
    return next(errorHandler(401, 'Your password is wrong'));

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  const token = createToken(user._id);
  createResponse(res, 200, {
    token,
    message: 'Your password changed successfully',
  });
});

module.exports = {
  signup,
  login,
  protected,
  restrictTo,
  forgotPassword,
  resetPassword,
  changePassword,
};
