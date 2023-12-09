const Review = require('../models/reviewModel');
const { deleteOne, updateOne, createOne, getAll } = require('./factoryHandler');

const setTourAndUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

const setTourId = (req, res, next) => {
  if (req.params.tourId) req.query.tour = req.params.tourId;

  next();
};
const createReview = createOne(Review);
const getAllReview = getAll(Review);
const deleteReview = deleteOne(Review);
const updateReview = updateOne(Review);

module.exports = {
  createReview,
  getAllReview,
  deleteReview,
  updateReview,
  setTourAndUserIds,
  setTourId,
};
