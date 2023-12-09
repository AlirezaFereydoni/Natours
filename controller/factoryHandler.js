const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/createResponse');
const errorHandler = require('../utils/errorHandler');

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) errorHandler(404, "Document isn't find with this ID");
    createResponse(res, 200, 'This document deleted successfully');
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    createResponse(res, 201, newDoc);
  });

module.exports = { createOne, deleteOne };
