const mongoose = require('mongoose');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name characters must be less or equal than 50 char'],
      minlength: [5, 'Name characters must be greater or equal than 10 char'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'ratingAverage must be greater than 1'],
      max: [5, 'ratingAverage must be less or equal than 5'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'The difficulty should be one of these attribute: easy, medium, difficult',
      },
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
    premium: { type: Boolean, default: false },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('weekDuration').get(function () {
  return this.duration / 7;
});

tourSchema.pre(/^find/, function (next) {
  this.find({ premium: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v',
  });
  next();
});

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { premium: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
