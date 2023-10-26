const Tour = require('../models/tour.model');
const { filters, sort } = require('../utils/apiFeatures');

const getFiveCheapMiddleware = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-duration,price';
  req.query.fields = 'name,price,duration,ratingAverage,difficulty';

  next();
};

// Get all tours
const getAllTour = async (req, res) => {
  try {
    const features = filters(req.query, Tour);
    const sorted = sort(req.query, features);

    const tours = await sorted;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

// Get specific tour
const getSpecificTour = async (req, res) => {
  try {
    const specificTour = await Tour.findById(req.params.id);

    res.status(200).json({ status: 'success', data: specificTour });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

// Create a new tour
const createTour = async (req, res) => {
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

// Update tour with PATCH
const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

// Delete a tour
const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ status: 'success', message: 'deleted successfully' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          tourCount: { $sum: 1 },
          tourQuantity: { $sum: '$ratingQuantity' },
          ratingAverage: { $avg: '$ratingAverage' },
          priceAverage: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { priceAverage: -1 } },
      { $match: { _id: { $ne: 'MEDIUM' } } },
    ]);

    res.status(200).json({
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const monthlyPlan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${req.params.year}-01-01`),
            $lte: new Date(`${req.params.year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          tours: { $push: '$name' },
          tourCount: { $sum: 1 },
        },
      },
      {
        $sort: { tourCount: -1 },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      { $limit: 12 },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan: monthlyPlan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

module.exports = {
  deleteTour,
  updateTour,
  createTour,
  getSpecificTour,
  getAllTour,
  getFiveCheapMiddleware,
  getTourStats,
  getMonthlyPlan,
};
