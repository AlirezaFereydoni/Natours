const createResponse = (res, statusCode, result, others) => {
  res.status(statusCode).json({
    status: 'success',
    ...others,
    data: {
      result,
    },
  });
};

module.exports = createResponse;
