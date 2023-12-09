const Tour = require('../models/tourModel');

const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/createResponse');

const {
  createOne,
  updateOne,
  deleteOne,
  getAll,
  getOne,
} = require('./factoryHandler');

const getFiveCheapMiddleware = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-duration,price';
  req.query.fields = 'name,price,duration,ratingAverage,difficulty';

  next();
};

// Get all tours
const getAllTour = getAll(Tour);

// Get specific tour
const getSpecificTour = getOne(Tour, { path: 'reviews' });

// Create a new tour
const createTour = createOne(Tour);

// Update tour with PATCH
const updateTour = updateOne(Tour);

// Delete a tour
const deleteTour = deleteOne(Tour);

const getTourStats = catchAsync(async (req, res, next) => {
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

  createResponse(res, 200, stats);
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
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

  createResponse(res, 200, monthlyPlan);
});

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
