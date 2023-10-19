const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
  },
  difficulty: {
    type: String,
    required: false,
    trim: true,
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Group size is required'],
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Summary is required'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: { type: String, required: [true, 'Image cover is required'] },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
