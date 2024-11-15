import slugify from "slugify";
import asyncHandler from "express-async-handler";
import ApiResponse from "#utils/api.response.js";
import Logger from "#utils/logger.js";
import ApiError from "#utils/api.error.js";
import SubCategory from "#models/sub.category.model.js";

// @desc Create a new sub category
// @route POST /api/v1/sub-categories
// @access Private
export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  // Check if the sub category name is already taken
  const subCategoryExists = await SubCategory.findOne({ name });
  if (subCategoryExists) {
    throw new ApiError(400, "Sub category name already taken");
  }

  // Create the slug
  const slug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  // Create the sub category
  const subCategory = await SubCategory.create({
    name,
    slug,
    category,
  });

  Logger.info("Sub category created successfully");

  res
    .status(201)
    .json(
      ApiResponse.success(201, "Sub category created successfully", subCategory)
    );
});

// @desc Get all sub categories
// @route GET /api/v1/sub-categories
// @access Public
export const getSubCategories = asyncHandler(async (req, res, next) => {
  const { skip, limit, getPagingData } = req.pagination;

  const totalItems = await SubCategory.countDocuments();
  const subCategories = await SubCategory.find({})
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const paginatedData = getPagingData(totalItems, subCategories);

  Logger.info("Sub categories retrieved successfully");

  res
    .status(200)
    .json(
      ApiResponse.success(
        200,
        "Sub categories fetched successfully",
        paginatedData
      )
    );
});

// @desc Get a sub category by ID
// @route GET /api/v1/sub-categories/:id
// @access Public
export const getSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    throw new ApiError(404, "Sub category not found");
  }

  res
    .status(200)
    .json(
      ApiResponse.success(200, "Sub category fetched successfully", subCategory)
    );
});

// @desc Update a sub category by ID
// @route PUT /api/v1/sub-categories/:id
// @access Private
export const updateSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    throw new ApiError(404, "Sub category not found");
  }

  const slug = slugify(req.body.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  const updatedSubCategory = await SubCategory.findByIdAndUpdate(
    subCategory._id,
    { name, slug },
    { new: true }
  );

  res
    .status(200)
    .json(
      ApiResponse.success(
        200,
        "Sub category updated successfully",
        updatedSubCategory
      )
    );
});

// @desc Delete a sub category by ID
// @route DELETE /api/v1/sub-categories/:id
// @access Private
export const deleteSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    throw new ApiError(404, "Sub category not found");
  }

  await subCategory.deleteOne();

  res
    .status(200)
    .json(ApiResponse.success(200, "Sub category deleted successfully"));
});

// @desc Get a sub category by slug
// @route GET /api/v1/sub-categories/:slug
// @access Public
export const getSubCategoryBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const subCategory = await SubCategory.findOne({ slug });
  if (!subCategory) {
    throw new ApiError(404, "Sub category not found");
  }

  res
    .status(200)
    .json(
      ApiResponse.success(200, "Sub category fetched successfully", subCategory)
    );
});

export default {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById,
  getSubCategoryBySlug,
};
