import { body, param } from "express-validator";

// Parameter validations for URL parameters
const paramValidations = {
  id: param("id")
    .notEmpty()
    .withMessage("Brand ID is required")
    .isMongoId()
    .withMessage("Invalid brand ID format"),

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
    .withMessage("Brand name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
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
  createBrand: validationChains.create,
  updateBrand: [paramValidations.id, ...validationChains.update],
  getBrandById: [paramValidations.id],
  deleteBrandById: [paramValidations.id],
  getBrandBySlug: [paramValidations.slug],
};
