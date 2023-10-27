const createResponse = (res, statusCode, result) => {
  res.status(statusCode).json({
    status: 'success',
    data: {
      result,
    },
  });
};

module.exports = createResponse;
