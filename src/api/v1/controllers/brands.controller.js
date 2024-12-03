import slugify from "slugify";
import asyncHandler from "express-async-handler";
import Brand from "#models/brand.model.js";
import Logger from "#utils/logger.js";
import ApiResponse from "#utils/api.response.js";
import ApiError from "#utils/api.error.js";
import ApiFeatures from "#utils/api.features.js";

// @desc Get all brands
// @route GET /api/v1/brands
// @access Public
export const getBrands = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(
    Brand.find(),
    req.query,
    req.pagination
  )
    .filter()
    .sort()
    .limitFields()
    .search()
    .pagination();

  const brands = await apiFeatures.execute();
  res
    .status(200)
    .json(ApiResponse.success(200, "Brands fetched successfully", brands));
});

// @desc Create a new brand
// @route POST /api/v1/brands
// @access Private
export const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const slug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  const brand = await Brand.create({
    ...req.body,
    slug,
  });

  Logger.info(`New brand created: ${brand.name} with slug: ${brand.slug}`);

  res
    .status(201)
    .json(ApiResponse.success(201, "Brand created successfully", brand));
});

// @desc Update a brand
// @route PUT /api/v1/brands/:id
// @access Private
export const updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      slug: slugify(req.body.name, { lower: true, strict: true, trim: true }),
    },
    { new: true, runValidators: true }
  );

  if (!brand) {
    return next(new ApiError(404, "Brand not found"));
  }

  Logger.info(`Brand updated: ${req.params.id}`);

  res
    .status(200)
    .json(ApiResponse.success(200, "Brand updated successfully", brand));
});

// @desc Delete a brand
// @route DELETE /api/v1/brands/:id
// @access Private
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);

  if (!brand) {
    return next(new ApiError(404, "Brand not found"));
  }

  Logger.info(`Brand deleted: ${req.params.id}`);
  res.status(200).json(ApiResponse.success(200, "Brand deleted successfully"));
});

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
