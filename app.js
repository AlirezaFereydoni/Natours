const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const errorHandler = require('./utils/errorHandler');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimiter({
  limit: 5,
  windowMs: 15 * 60 * 1000,
});

app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Routes
app.use('/api/tours', tourRoutes);
app.use('/api/users', userRoutes);

app.all('*', (req, res, next) => {
  errorHandler(404, "The requested url isn't exist");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'Error';

  res.status(statusCode).json({ status, message: err.message });
});

module.exports = app;
