import slugify from "slugify";
import asyncHandler from "express-async-handler";
import Product from "#models/product.model.js";
import Logger from "#utils/logger.js";
import ApiResponse from "#utils/api.response.js";
import ApiError from "#utils/api.error.js";

// @desc Get all products
// @route GET /api/v1/products
// @access Public
export const getProducts = asyncHandler(async (req, res, next) => {
  // @desc Get query string object
  let queryStringObject = { ...req.query };
  const excludeFields = ["skip", "limit", "page", "sort", "filter", "fields", "keyword"];

  // @desc Delete exclude fields from query string object
  excludeFields.forEach((field) => delete queryStringObject[field]);

  // @desc Replace gte, gt, lte, lt with $gte, $gt, $lte, $lt in query string object
  let queryString = JSON.stringify(queryStringObject);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  // @desc Parse query string to object
  queryStringObject = JSON.parse(queryString);

  // @desc Build filter conditions
  let filterConditions = { ...queryStringObject };
  
  // @desc Add search conditions if keyword exists
  if (req.query.keyword) {
    filterConditions = {
      ...filterConditions,
      $or: [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ],
    };
  }

  // @desc Get total count with all filters applied
  const totalItems = await Product.countDocuments(filterConditions);

  // @desc Build query with same conditions
  let query = Product.find(filterConditions);

  // @desc Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // @desc Field Limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  // @desc Get pagination data
  const { skip, limit, getPagingData } = req.pagination;

  // @desc Execute query with pagination and population
  const products = await query
    .skip(skip)
    .limit(limit)
    .populate("category", "name -_id")
    .populate("subcategories", "name -_id")
    .populate("brand", "name -_id");

  // @desc Get paginated data
  const paginatedData = getPagingData(totalItems, products);

  Logger.info("Products retrieved successfully");

  res
    .status(200)
    .json(
      ApiResponse.success(200, "Products retrieved successfully", paginatedData)
    );
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
