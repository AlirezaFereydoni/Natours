const express = require('express');
const {
  getAllUsers,
  updateMe,
  deActiveMe,
} = require('../controller/userController');
const authController = require('../controller/authController');

const router = express.Router();

// Authentication Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);
router.patch(
  '/changePassword',
  authController.protected,
  authController.changePassword,
);

// Users
router.patch('/updateMe', authController.protected, updateMe);
router.patch('/deActiveMe', authController.protected, deActiveMe);
router.route('/').get(getAllUsers);
// router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
