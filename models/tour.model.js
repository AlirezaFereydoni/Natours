const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  difficulty: {
    type: String,
    required: false,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
