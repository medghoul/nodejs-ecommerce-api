import slugify from "slugify";
import asyncHandler from "express-async-handler";
import Brand from "#models/brand.model.js";
import Logger from "#utils/logger.js";
import ApiResponse from "#utils/api.response.js";
import ApiError from "#utils/api.error.js";
import {
  deleteOne,
  createOne,
  getOne,
  updateOne,
  getAll,
} from "#utils/handlers.factory.js";

// @desc Get all brands
// @route GET /api/v1/brands
// @access Public
export const getBrands = getAll(Brand);

// @desc Create a new brand
// @route POST /api/v1/brands
// @access Private
export const createBrand = createOne(Brand);

// @desc Update a brand
// @route PUT /api/v1/brands/:id
// @access Private
export const updateBrand = updateOne(Brand);

// @desc Delete a brand
// @route DELETE /api/v1/brands/:id
// @access Private
export const deleteBrand = deleteOne(Brand);

// @desc Get a brand by slug
// @route GET /api/v1/brands/:slug
// @access Public
export const getBrandBySlug = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findOne({ slug: req.params.slug });

  if (!brand) {
    return next(new ApiError(404, "Brand not found"));
  }

  res
    .status(200)
    .json(ApiResponse.success(200, "Brand retrieved successfully", brand));
});

// @desc Get a brand by id
// @route GET /api/v1/brands/:id
// @access Public
export const getBrandById = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return next(new ApiError(404, "Brand not found"));
  }

  res
    .status(200)
    .json(ApiResponse.success(200, "Brand retrieved successfully", brand));
});
