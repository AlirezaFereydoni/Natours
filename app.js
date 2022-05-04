const express = require('express');

const morgan = require('morgan');
const tourRouter = require('./router/tourRouter');
const userRouter = require('./router/userRouter');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

// Routes
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

// Server

app.listen(8000, '127.0.0.1', () => {
  console.log('Server running ...');
});
