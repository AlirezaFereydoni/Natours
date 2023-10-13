const Tour = require('../models/tour.model');

// Get all tours
exports.getAllTour = (req, res) => {};

// Get specific tour
exports.getSpecificTour = (req, res) => {};

// Create a new tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Update tour with PUT
exports.updateTour = (req, res) => {};

// Delete a tour
exports.deleteTour = (req, res) => {};
