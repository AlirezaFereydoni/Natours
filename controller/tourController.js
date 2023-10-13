const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkId = (req, res, next, val) => {
  if (!req.params.id) {
    return res.status(404).json({ status: 'fail', message: 'not found' });
  }

  next();
};

exports.checkRequirements = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({ status: 'fail', message: 'Missing name or price' });
  }

  next();
};

// Get all tours
exports.getAllTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

// Get specific tour
exports.getSpecificTour = (req, res) => {
  const { id } = req.params;
  const specificTour = tours.find(tour => tour.id === Number(id));

  res.status(200).json({
    status: 'success',
    data: specificTour,
  });
};

// Create a new tour
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id++;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    if (err) {
      res.status(400).json({ status: 'Fail', message: 'Bad Request', data: {} });
    }

    res.status(200).json({
      status: 'Success',
      data: newTour,
    });
  });
};

// Update tour with PUT
exports.updateTour = (req, res) => {
  const { params, body } = req;

  const tourIndex = tours.findIndex(item => item.id === Number(params.id));

  if (tourIndex === -1) {
    res.status(404).json({ status: 'not found', message: "tour wasn't found" });
  }

  tours.splice(tourIndex, 1, { id: tours[tourIndex].id, ...body });

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    if (err) {
      res.status(500).json({ status: 'failed', message: 'something is wrong' });
    }

    res.status(200).json({ status: 'success', data: tours[tourIndex] });
  });
};

// Delete a tour
exports.deleteTour = (req, res) => {
  const { id } = req.params;
  const tourIndex = tours.findIndex(item => item.id === Number(id));

  if (tourIndex === -1) {
    res.status(404).json({ status: 'not found', message: "tour wasn't found" });
  }

  tours.splice(tourIndex, 1);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    if (err) {
      res
        .status(500)
        .json({ status: 'failed', message: 'there is a problem here please try again later' });
    }

    res.status(200).json({ status: 'success' });
  });
};
