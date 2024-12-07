import Category from "#models/category.model.js";
import {
  deleteOne,
  createOne,
  getOne,
  updateOne,
  getAll,
} from "#utils/handlers.factory.js";


// @desc Get all categories
// @route GET /api/v1/categories
// @access Public
export const getCategories = getAll(Category);

// @desc Create a new category
// @route POST /api/v1/categories
// @access Private
export const createCategory = createOne(Category);


// @desc Update a category
// @route PUT /api/v1/categories/:id
// @access Private
export const updateCategory = updateOne(Category);

// @desc Delete a category
// @route DELETE /api/v1/categories/:id
// @access Private
export const deleteCategory = deleteOne(Category);


// @desc Get a category by slug
// @route GET /api/v1/categories/:slug
// @access Public
export const getCategoryBySlug = getOne(Category, "slug");

// @desc Get a category by id
// @route GET /api/v1/categories/:id
// @access Public
export const getCategoryById = getOne(Category);

