const express = require('express');

const router = express.Router();

// Get All Users
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

// Get Specific User
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

// Create User
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

// Update User
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

// Delete User
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

// Users
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
