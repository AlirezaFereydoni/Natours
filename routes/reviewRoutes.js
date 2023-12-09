const express = require('express');
const reviewController = require('../controller/reviewController');
const authController = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protected,
    authController.restrictTo('normal'),
    reviewController.setTourAndUserIds,
    reviewController.createReview,
  )
  .get(reviewController.getAllReview);

router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
