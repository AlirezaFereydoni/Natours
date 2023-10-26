const express = require('express');

const router = express.Router();
const tourController = require('../controller/tourController');

// Routes

router.route('/stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/get-5-cheap')
  .get(tourController.getFiveCheapMiddleware, tourController.getAllTour);

router
  .route('/')
  .get(tourController.getAllTour)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getSpecificTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
