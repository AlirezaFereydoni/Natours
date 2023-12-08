const express = require('express');
const reviewController = require('../controller/reviewController');
const authController = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protected,
    authController.restrictTo('normal'),
    reviewController.createReview,
  )
  .get(reviewController.getAllReview);

module.exports = router;
