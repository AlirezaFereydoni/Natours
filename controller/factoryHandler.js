const catchAsync = require('../utils/catchAsync');
const createResponse = require('../utils/createResponse');
const errorHandler = require('../utils/errorHandler');
const { filters, sort } = require('../utils/apiFeatures');

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    createResponse(res, 201, newDoc);
  });

const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const specificDoc = await Model.findById(req.params.id);

    if (populateOptions) specificDoc.populate(populateOptions);

    if (!specificDoc) errorHandler(404, "Document isn't find with this ID");
    createResponse(res, 200, specificDoc);
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = filters(req.query, Model);
    const sorted = sort(req.query, features);

    const docs = await sorted;

    createResponse(res, 200, docs);
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) errorHandler(404, "Document isn't find with this ID");
    createResponse(res, 200, updatedDoc);
  });

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) errorHandler(404, "Document isn't find with this ID");
    createResponse(res, 200, 'This document deleted successfully');
  });

module.exports = { createOne, getOne, getAll, updateOne, deleteOne };
