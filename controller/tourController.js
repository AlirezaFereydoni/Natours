const Tour = require('../models/tour.model');

// Get all tours
exports.getAllTour = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

// Get specific tour
exports.getSpecificTour = async (req, res) => {
  try {
    const specificTour = await Tour.findById(req.params.id);

    res.status(200).json({ status: 'success', data: specificTour });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

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
