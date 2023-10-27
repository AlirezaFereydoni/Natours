const errorHandler = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = /^4/.test(statusCode) ? 'fail' : 'error';
  throw error;
};

module.exports = errorHandler;
