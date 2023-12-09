const express = require('express');
const {
  getAllUsers,
  updateMe,
  deActiveMe,
  getUser,
  setIdToParams,
  updateUser,
  deleteUser,
} = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

// Authentication Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);

router.use(authController.protected);

// Users
router.patch('/changePassword', authController.changePassword);
router.patch('/updateMe', updateMe);
router.patch('/deActiveMe', deActiveMe);
router.get('/me', setIdToParams, getUser);

router.use(authController.restrictTo('admin'));

router.route('/').get(getAllUsers).patch(updateUser).delete(deleteUser);

module.exports = router;
