const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const app = express();

app.use(morgan('dev'));

app.use(express.json());

// Get all tours
const getAllTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

// Get specific tour
const getSpecificTour = (req, res) => {
  const { id } = req.params;
  const specificTour = tours.find(tour => tour.id === Number(id));

  if (!specificTour) {
    res.status(404).json({ status: 'fail', message: 'not found' });
  }

  res.status(200).json({
    status: 'success',
    data: specificTour,
  });
};

// Create a new tour
const createTour = (req, res) => {
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
const updateTour = (req, res) => {
  const { id } = req.params;
  const updatedTours = tours.map(tour => (tour.id === Number(id) ? req.body : tour));

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    err => {
      if (err) {
        res.status(500).json({ status: 'Fail', message: 'something goes wrong...' });
      }

      res.status(200).json({
        status: 'Success',
        data: {},
      });
    }
  );
};

// Delete a tour
const deleteTour = (req, res) => {
  const { id } = req.params;

  const updatedTours = tours.filter(tour => tour.id !== Number(id));

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    err => {
      if (err) {
        res.status(500).json({ status: 'Fail', message: 'something goes wrong' });
      }

      res.status(204).json({ status: 'Success', data: null });
    }
  );
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Something goes wrong',
  });
};

// Routes

app.route('/api/tours').get(getAllTour).post(createTour);
app.route('/api/tours/:id').get(getSpecificTour).put(updateTour).delete(deleteTour);

// Users
app.route('/api/users').get(getAllUsers).post(createUser);
app.route('/api/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

// Server

app.listen(8000, '127.0.0.1', () => {
  console.log('Server running ...');
});
