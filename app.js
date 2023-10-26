const express = require('express');
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Routes
app.use('/api/tours', tourRoutes);
app.use('/api/users', userRoutes);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: "The requested url isn't exist",
  });
});

module.exports = app;
