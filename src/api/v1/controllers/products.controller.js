import slugify from "slugify";
import asyncHandler from "express-async-handler";
import Product from "#models/product.model.js";
import Logger from "#utils/logger.js";
import ApiResponse from "#utils/api.response.js";
import ApiError from "#utils/api.error.js";
import ApiFeatures from "#utils/api.features.js";

// @desc Get all products
// @route GET /api/v1/products
// @access Public
export const getProducts = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Product.find(), req.query, req.pagination)
    .filter()
    .sort()
    .limitFields()
    .search()
    .pagination();

  const result = await apiFeatures.execute();

  Logger.info("Products retrieved successfully");
  res
    .status(200)
    .json(ApiResponse.success(200, "Products retrieved successfully", result));
});

// @desc Create a new product
// @route POST /api/v1/products
// @access Private
export const createProduct = asyncHandler(async (req, res, next) => {
  const { title } = req.body;

  const slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  const product = await Product.create({
    ...req.body,
    slug,
  });

  Logger.info(
    `New product created: ${product.title} with slug: ${product.slug}`
  );

  res
    .status(201)
    .json(ApiResponse.success(201, "Product created successfully", product));
});

// @desc Update a product
// @route PUT /api/v1/products/:id
// @access Private
export const updateProduct = asyncHandler(async (req, res, next) => {
  // Create update object with only the fields that are present in req.body
  const updateFields = {};

  // Iterate through request body and add only present fields
  Object.keys(req.body).forEach((key) => {
    updateFields[key] = req.body[key];
  });

  // If title is being updated, update the slug as well
  if (req.body.title) {
    updateFields.slug = slugify(req.body.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  Logger.info(`Product updated: ${req.params.id}`);

  res
    .status(200)
    .json(ApiResponse.success(200, "Product updated successfully", product));
});

// @desc Delete a product
// @route DELETE /api/v1/products/:id
// @access Private
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  Logger.info(`Product deleted: ${req.params.id}`);
  res
    .status(200)
    .json(ApiResponse.success(200, "Product deleted successfully"));
});

// @desc Get a product by slug
// @route GET /api/v1/products/:slug
// @access Public
export const getProductBySlug = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  res
    .status(200)
    .json(ApiResponse.success(200, "Product retrieved successfully", product));
});

// @desc Get a product by id
// @route GET /api/v1/products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name -_id")
    .populate("subcategories", "name -_id")
    .populate("brand", "name -_id");

  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  res
    .status(200)
    .json(ApiResponse.success(200, "Product retrieved successfully", product));
});
