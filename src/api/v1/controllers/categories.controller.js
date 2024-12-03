import slugify from "slugify";
import asyncHandler from "express-async-handler";
import Category from "#models/category.model.js";
import Logger from "#utils/logger.js";
import ApiResponse from "#utils/api.response.js";
import ApiError from "#utils/api.error.js";
import ApiFeatures from "#utils/api.features.js";
// @desc Get all categories
// @route GET /api/v1/categories
// @access Public
export const getCategories = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(
    Category.find(),
    req.query,
    req.pagination
  )
    .filter()
    .sort()
    .limitFields()
    .search()
    .pagination();

  const categories = await apiFeatures.execute();
  res
    .status(200)
    .json(
      ApiResponse.success(200, "Categories fetched successfully", categories)
    );
});

// @desc Create a new category
// @route POST /api/v1/categories
// @access Private
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const slug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  const category = await Category.create({
    ...req.body,
    slug,
  });

  Logger.info(
    `New category created: ${category.name} with slug: ${category.slug}`
  );

  res
    .status(201)
    .json(ApiResponse.success(201, "Category created successfully", category));
});

// @desc Update a category
// @route PUT /api/v1/categories/:id
// @access Private
export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      slug: slugify(req.body.name, { lower: true, strict: true, trim: true }),
    },
    { new: true, runValidators: true }
  );

  if (!category) {
    return next(new ApiError(404, "Category not found"));
  }

  Logger.info(`Category updated: ${req.params.id}`);

  res
    .status(200)
    .json(ApiResponse.success(200, "Category updated successfully", category));
});

// @desc Delete a category
// @route DELETE /api/v1/categories/:id
// @access Private
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new ApiError(404, "Category not found"));
  }

  Logger.info(`Category deleted: ${req.params.id}`);
  res
    .status(200)
    .json(ApiResponse.success(200, "Category deleted successfully"));
});

// @desc Get a category by slug
// @route GET /api/v1/categories/:slug
// @access Public
export const getCategoryBySlug = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    return next(new ApiError(404, "Category not found"));
  }

  res
    .status(200)
    .json(
      ApiResponse.success(200, "Category retrieved successfully", category)
    );
});

// @desc Get a category by id
// @route GET /api/v1/categories/:id
// @access Public
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ApiError(404, "Category not found"));
  }

  res
    .status(200)
    .json(
      ApiResponse.success(200, "Category retrieved successfully", category)
    );
});
