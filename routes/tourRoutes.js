const fs = require('fs');
const express = require('express');
const router = express.Router();
const tourController = require('../controller/tourController');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// Routes
router.route('/').get(tourController.getAllTour).post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getSpecificTour)
  .put(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
