const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const errorHandler = require('./utils/errorHandler');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Prevent Brute force with limit count of api per 15m
const limiter = rateLimiter({
  limit: 100,
  windowMs: 15 * 60 * 1000,
});
app.use('/api', limiter);

// Prevent SQL Injection
app.use(mongoSanitize());

// Prevent XSS Attacks
app.use(xss());

app.use(hpp());

app.use(express.json({ limit: '50kb' }));
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
