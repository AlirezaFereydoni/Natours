const express = require('express');

const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

// Routes
app.use('/api/tours', tourRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
