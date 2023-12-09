const express = require('express');

const router = express.Router();
const tourController = require('../controller/tourController');
const authController = require('../controller/authController');

const ReviewRouter = require('./reviewRoutes');

// Review
router.use('/:tourId/reviews', ReviewRouter);

// Routes

router.route('/stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protected,
    authController.restrictTo('tourLead', 'tourGuide', 'admin'),
    tourController.getMonthlyPlan,
  );

router
  .route('/get-5-cheap')
  .get(
    authController.protected,
    authController.restrictTo('tourLead', 'tourGuide', 'admin'),
    tourController.getFiveCheapMiddleware,
    tourController.getAllTour,
  );

router
  .route('/')
  .get(tourController.getAllTour)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getSpecificTour)
  .patch(
    authController.protected,
    authController.restrictTo('tourLead', 'tourGuide', 'admin'),
    tourController.updateTour,
  )
  .delete(
    authController.protected,
    authController.restrictTo('admin', 'tourLead', 'tourGuide'),
    tourController.deleteTour,
  );

module.exports = router;
