import asyncHandler from "express-async-handler";
import Logger from "#utils/logger.js";
import ApiResponse from "#utils/api.response.js";
import ApiError from "#utils/api.error.js";
import ApiFeatures from "#utils/api.features.js";

/**
 * Factory class for common CRUD operation handlers
 * @class HandlersFactory
 */

/**
 * Creates a handler for getting all documents of a given model
 * @function getAll
 * @param {import('mongoose').Model} Model - Mongoose model to perform get operation on
 * @returns {Function} Express middleware function that handles get all operation
 */
export const getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(Model.find(), req.query, req.pagination)
      .filter()
      .sort()
      .limitFields()
      .search(Model.modelName)
      .pagination();

    const result = await apiFeatures.execute();

    Logger.info(`${Model.modelName}s retrieved successfully`);
    res
      .status(200)
      .json(
        ApiResponse.success(
          200,
          `${Model.modelName}s retrieved successfully`,
          result
        )
      );
  });

/**
 * Creates a handler for getting a single document by ID
 * @function getOne
 * @param {import('mongoose').Model} Model - Mongoose model to perform get operation on
 * @param {Object} [popOptions] - Populate options for mongoose query
 * @returns {Function} Express middleware function that handles get one operation
 * @throws {ApiError} 404 if document is not found
 */
export const getOne = (Model, popOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new ApiError(404, `${Model.modelName} not found`));
    }

    res
      .status(200)
      .json(
        ApiResponse.success(
          200,
          `${Model.modelName} retrieved successfully`,
          doc
        )
      );
  });

/**
 * Creates a handler for creating a new document
 * @function createOne
 * @param {import('mongoose').Model} Model - Mongoose model to perform create operation on
 * @returns {Function} Express middleware function that handles create operation
 */
export const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);

    if (!doc) {
      return next(new ApiError(400, `${Model.modelName} not created`));
    }

    Logger.info(`New ${Model.modelName} created: ${doc._id}`);
    res
      .status(201)
      .json(
        ApiResponse.success(201, `${Model.modelName} created successfully`, doc)
      );
  });

/**
 * Creates a handler for updating a document
 * @function updateOne
 * @param {import('mongoose').Model} Model - Mongoose model to perform update operation on
 * @returns {Function} Express middleware function that handles update operation
 * @throws {ApiError} 404 if document is not found
 */
export const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new ApiError(404, `${Model.modelName} not found`));
    }

    Logger.info(`${Model.modelName} updated: ${req.params.id}`);
    res
      .status(200)
      .json(
        ApiResponse.success(200, `${Model.modelName} updated successfully`, doc)
      );
  });

/**
 * Creates a delete operation handler for a given model
 * @function deleteOne
 * @param {import('mongoose').Model} Model - Mongoose model to perform delete operation on
 * @returns {Function} Express middleware function that handles delete operation
 * @throws {ApiError} 404 if document is not found
 */
export const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new ApiError(404, `${Model.modelName} not found`));
    }

    Logger.info(`${Model.modelName} deleted: ${req.params.id}`);
    res
      .status(200)
      .json(
        ApiResponse.success(200, `${Model.modelName} deleted successfully`)
      );
  });
