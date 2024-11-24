import SubCategory from "#models/subcategory.model.js";
import ApiError from "#utils/api.error.js";
import ApiResponse from "#utils/api.response.js";
import Logger from "#utils/logger.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import ApiFeatures from "#utils/api.features.js";
// @desc middleware to set the categoryId to the body if it is not present
export const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc Create a new sub category
// @route POST /api/v1/subcategories
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

// @desc middleware filter the categoryId from the params if it is present
// Nested route
// @route GET /api/v1/categories/:categoryId/subcategories
export const filterCategoryIdFromParams = (req, res, next) => {
  // Create filter object based on categoryId presence
  const filterObject = req.params.categoryId
    ? { category: req.params.categoryId }
    : {};
  req.filterObject = filterObject;
  next();
};

// @desc Get all sub categories
// @route GET /api/v1/subcategories
// @access Public
export const getSubCategories = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(
    SubCategory.find(),
    req.query,
    req.pagination
  );
  const subCategories = await apiFeatures.execute();
  res
    .status(200)
    .json(
      ApiResponse.success(
        200,
        "Sub categories fetched successfully",
        subCategories
      )
    );
});

// @desc Get a sub category by ID
// @route GET /api/v1/subcategories/:id
// @access Public
export const getSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findById(id).populate({
    path: "category",
    select: "_id name",
  });
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
// @route PUT /api/v1/subcategories/:id
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
// @route DELETE /api/v1/subcategories/:id
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
// @route GET /api/v1/subcategories/:slug
// @access Public
export const getSubCategoryBySlug = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const subCategory = await SubCategory.findOne({ slug }).populate({
    path: "category",
    select: "_id name",
  });
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
  filterCategoryIdFromParams,
  setCategoryIdToBody,
};
