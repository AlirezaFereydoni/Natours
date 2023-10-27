const Tour = require('../models/tourModel');
const { filters, sort } = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/createResponse');
const errorHandler = require('../utils/errorHandler');

const getFiveCheapMiddleware = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-duration,price';
  req.query.fields = 'name,price,duration,ratingAverage,difficulty';

  next();
};

// Get all tours
const getAllTour = catchAsync(async (req, res, next) => {
  const features = filters(req.query, Tour);
  const sorted = sort(req.query, features);

  const tours = await sorted;

  createResponse(res, 200, tours);
});

// Get specific tour
const getSpecificTour = catchAsync(async (req, res, next) => {
  const specificTour = await Tour.findById(req.params.id);
  if (!specificTour) errorHandler(404, "Tour isn't find with this ID");
  createResponse(res, 200, specificTour);
});

// Create a new tour
const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  createResponse(res, 201, newTour);
});

// Update tour with PATCH
const updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedTour) errorHandler(404, "Tour isn't find with this ID");
  createResponse(res, 200, updatedTour);
});

// Delete a tour
const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) errorHandler(404, "Tour isn't find with this ID");
  createResponse(res, 200, 'deleted successfully');
});

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
