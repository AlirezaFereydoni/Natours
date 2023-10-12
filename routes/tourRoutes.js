const express = require('express');

const router = express.Router();
const tourController = require('../controller/tourController');

router.param('id', tourController.checkId);

// Routes
router
  .route('/')
  .get(tourController.getAllTour)
  .post(tourController.checkRequirements, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getSpecificTour)
  .put(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
