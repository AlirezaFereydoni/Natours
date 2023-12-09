const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/createResponse');
const { filters, sort } = require('../utils/apiFeatures');
const { deleteOne, updateOne, createOne } = require('./factoryHandler');

const setTourAndUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

const createReview = createOne(Review);

const getAllReview = catchAsync(async (req, res, next) => {
  let filter = { ...req.query };
  if (req.params.tourId) filter = { ...req.query, tour: req.params.tourId };
  const filtered = filters(filter, Review);
  const sorted = sort(req.query, filtered);
  const reviews = await sorted;
  createResponse(res, 200, reviews);
});

const deleteReview = deleteOne(Review);
const updateReview = updateOne(Review);

module.exports = {
  createReview,
  getAllReview,
  deleteReview,
  updateReview,
  setTourAndUserIds,
};
