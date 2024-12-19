import { body, param } from "express-validator";
import User from "#models/user.model.js";
import ApiError from "#utils/api.error.js";

// Parameter validations
const paramValidations = {
  id: param("id")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),

  slug: param("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Invalid slug format"),
};

// Field validations
const fieldValidations = {
  name: body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Name must be between 3 and 32 characters"),

  email: body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .toLowerCase()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new ApiError(400, "Email already exists");
      }
    }),

  password: body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  phone: body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage("Invalid phone number format"),

  role: body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),

  profileImage: body("profileImage")
    .optional()
    .isString()
    .withMessage("Profile image must be a string"),

  isEmailVerified: body("isEmailVerified")
    .optional()
    .isBoolean()
    .withMessage("Email verification status must be a boolean"),

  isPhoneVerified: body("isPhoneVerified")
    .optional()
    .isBoolean()
    .withMessage("Phone verification status must be a boolean"),
};

// Helper function to make fields optional for updates
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

export default {
  createUser: validationChains.create,
  updateUser: [paramValidations.id, ...validationChains.update],
  getUserById: [paramValidations.id],
  deleteUserById: [paramValidations.id],
  getUserBySlug: [paramValidations.slug],
};
