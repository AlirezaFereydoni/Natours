const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/createResponse');
const { filters, sort } = require('../utils/apiFeatures');

const createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  console.log(req.user);

  const newReview = await Review.create(req.body);
  createResponse(res, 201, newReview);
});
const getAllReview = catchAsync(async (req, res, next) => {
  const filtered = filters(req.query, Review);
  const sorted = sort(req.query, filtered);
  const reviews = await sorted;
  createResponse(res, 200, reviews);
});

module.exports = {
  createReview,
  getAllReview,
};
