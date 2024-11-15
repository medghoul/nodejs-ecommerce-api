import { body, param } from "express-validator";

// Common validation rules
const nameValidation = body("name")
  .trim()
  .notEmpty()
  .withMessage("Category name is required")
  .isLength({ min: 3 })
  .withMessage("Name must be at least 3 characters long")
  .isLength({ max: 32 })
  .withMessage("Name cannot be longer than 32 characters");

const optionalNameValidation = body("name")
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Category name cannot be empty")
  .isLength({ min: 3 })
  .withMessage("Name must be at least 3 characters long")
  .isLength({ max: 32 })
  .withMessage("Name cannot be longer than 32 characters");

const imageValidation = body("image")
  .optional()
  .isURL()
  .withMessage("Image must be a valid URL");

const idValidation = param("id")
  .notEmpty()
  .withMessage("Category ID is required")
  .isMongoId()
  .withMessage("Invalid category ID");

const slugValidation = param("slug")
  .trim()
  .notEmpty()
  .withMessage("Slug is required")
  .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .withMessage("Invalid slug format");

export default {
  createCategory: [nameValidation, imageValidation],
  updateCategory: [idValidation, optionalNameValidation, imageValidation],
  getCategoryById: [idValidation],
  deleteCategoryById: [idValidation],
  getCategoryBySlug: [slugValidation]
};
