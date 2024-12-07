import { body, param } from "express-validator";
import Category from "#models/category.model.js";

// Parameter validations for URL parameters
const paramValidations = {
  id: param("id")
    .notEmpty()
    .withMessage("Subcategory ID is required")
    .isMongoId()
    .withMessage("Invalid subcategory ID format"),

  slug: param("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Invalid slug format")
    .isLength({ max: 100 })
    .withMessage("Slug cannot be longer than 100 characters"),
};

// Field validations for request body
const fieldValidations = {
  name: body("name")
    .trim()
    .notEmpty()
    .withMessage("Subcategory name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long")
    .isLength({ max: 32 })
    .withMessage("Name cannot be longer than 32 characters")
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage("Name can only contain letters, numbers, spaces and hyphens"),

  image: body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image must be a valid URL")
    .matches(/\.(jpg|jpeg|png|gif|webp)$/i)
    .withMessage("Image URL must end with a valid image extension"),

  category: body("category")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`Category with ID ${categoryId} does not exist`);
      }
      return true;
    }),
};

/**
 * Helper function to make fields optional for updates
 * @param {Object} validations - Object containing validation chains
 * @returns {Object} New object with all validations made optional
 */
const makeOptional = (validations) => {
  const optionalValidations = {};
  for (const [field, validation] of Object.entries(validations)) {
    optionalValidations[field] = validation.optional();
  }
  return optionalValidations;
};

// Create validation chains for different operations
const validationChains = {
  create: Object.values(fieldValidations),
  update: Object.values(makeOptional(fieldValidations)),
};

// Export validation chains for different routes
export default {
  createSubCategory: validationChains.create,
  updateSubCategory: [paramValidations.id, ...validationChains.update],
  getSubCategoryById: [paramValidations.id],
  deleteSubCategoryById: [paramValidations.id],
  getSubCategoryBySlug: [paramValidations.slug],
};
