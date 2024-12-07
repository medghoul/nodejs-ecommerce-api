import Product from "#models/product.model.js";
import { getOne, getAll, createOne, updateOne, deleteOne } from "#utils/handlers.factory.js";

// @desc Get all products
// @route GET /api/v1/products
// @access Public
export const getProducts = getAll(Product);

// @desc Create a new product
// @route POST /api/v1/products
// @access Private
export const createProduct = createOne(Product);

// @desc Update a product
// @route PUT /api/v1/products/:id
// @access Private
export const updateProduct = updateOne(Product);


// @desc Delete a product
// @route DELETE /api/v1/products/:id
// @access Private
export const deleteProduct = deleteOne(Product);

// @desc Get a product by slug
// @route GET /api/v1/products/:slug
// @access Public
export const getProductBySlug = getOne(Product, "slug");


// @desc Get a product by id
// @route GET /api/v1/products/:id
// @access Public
export const getProductById = getOne(Product);
