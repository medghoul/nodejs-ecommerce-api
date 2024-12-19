import User from "#models/user.model.js";
import {
  deleteOne,
  createOne,
  getOne,
  updateOne,
  getAll,
} from "#utils/handlers.factory.js";

// @desc Get all users
// @route GET /api/v1/users
// @access Private
export const getUsers = getAll(User);

// @desc Create a new user
// @route POST /api/v1/users
// @access Private
export const createUser = createOne(User);

// @desc Update a user
// @route PUT /api/v1/users/:id
// @access Private
export const updateUser = updateOne(User);

// @desc Delete a user
// @route DELETE /api/v1/users/:id
// @access Private
export const deleteUser = deleteOne(User);

// @desc Get a user by slug
// @route GET /api/v1/users/:slug
// @access Private
export const getUserBySlug = getOne(User, "slug");

// @desc Get a user by id
// @route GET /api/v1/users/:id
// @access Private
export const getUserById = getOne(User);
