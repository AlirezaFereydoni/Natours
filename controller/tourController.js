const Tour = require('../models/tour.model');

// Get all tours
exports.getAllTour = async (req, res) => {
  try {
    const queries = { ...req.query };
    const excludedQueries = ['page', 'sort', 'limit', 'fields'];

    excludedQueries.forEach((el) => delete queries[el]);

    let queryStr = JSON.stringify(queries);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const query = Tour.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query.select(fields);
    } else {
      query.select('-__v');
    }
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('Page does not exist');
    }

    query.skip(skip).limit(limit);

    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
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

// Update tour with PATCH
exports.updateTour = async (req, res) => {
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
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ status: 'success', message: 'deleted successfully' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};
