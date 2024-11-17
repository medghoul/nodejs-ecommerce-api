import { body, param } from "express-validator";

// Common validation rules
const nameValidation = body("name")
  .trim()
  .notEmpty()
  .withMessage("Subcategory name is required")
  .isLength({ min: 2 })
  .withMessage("Name must be at least 2 characters long")
  .isLength({ max: 32 })
  .withMessage("Name cannot be longer than 32 characters");

const optionalNameValidation = body("name")
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Subcategory name cannot be empty")
  .isLength({ min: 2 })
  .withMessage("Name must be at least 2 characters long")
  .isLength({ max: 32 })
  .withMessage("Name cannot be longer than 32 characters");

const imageValidation = body("image")
  .optional()
  .isURL()
  .withMessage("Image must be a valid URL");

const idValidation = param("id")
  .notEmpty()
  .withMessage("Subcategory ID is required")
  .isMongoId()
  .withMessage("Invalid subcategory ID");

const slugValidation = param("slug")
  .trim()
  .notEmpty()
  .withMessage("Slug is required")
  .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .withMessage("Invalid slug format");

const categoryValidation = body("category")
  .notEmpty()
  .withMessage("Subcategory is required")
  .isMongoId()
  .withMessage("Invalid subcategory ID");

export default {
  createSubCategory: [nameValidation, categoryValidation],
  updateSubCategory: [idValidation, optionalNameValidation, imageValidation],
  getSubCategoryById: [idValidation],
  deleteSubCategoryById: [idValidation],
  getSubCategoryBySlug: [slugValidation],
};
