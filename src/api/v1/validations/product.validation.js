import { body, param } from "express-validator";
import mongoose from "mongoose";
import Category from "#models/category.model.js";
import Brand from "#models/brand.model.js";
import Subcategory from "#models/subcategory.model.js";

// Parameter validations
const paramValidations = {
  id: param("id")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),

  slug: param("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Invalid slug format"),
};

// Field validations
const fieldValidations = {
  title: body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Title must be between 3 and 32 characters"),

  description: body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  quantity: body("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  price: body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  imageCover: body("imageCover")
    .notEmpty()
    .withMessage("Image cover is required"),

  category: body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`Category with ID ${categoryId} not exists`);
      }
      return true;
    }),

  // Optional fields
  subcategories: body("subcategories")
    .optional()
    .isArray()
    .withMessage("Subcategories must be an array")
    .custom(async (subcategoriesIds, { req }) => {
      // First validate that all IDs are valid MongoDB ObjectIDs
      if (!subcategoriesIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("Invalid subcategory ID format");
      }

      // Find all subcategories
      const subcategories = await Subcategory.find({ 
        _id: { $in: subcategoriesIds },
        category: req.body.category // Only find subcategories that belong to the specified category
      });

      // Check if all subcategories were found
      const foundIds = subcategories.map(sub => sub._id.toString());
      const notFoundIds = subcategoriesIds.filter(
        id => !foundIds.includes(id.toString())
      );

      if (notFoundIds.length > 0) {
        throw new Error(
          `Subcategories with IDs ${notFoundIds.join(", ")} either do not exist or do not belong to the specified category`
        );
      }

      return true;
    }),

  brand: body("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand ID")
    .custom(async (brandId) => {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        throw new Error(`Brand with ID ${brandId} not exists`);
      }
      return true;
    }),

  colors: body("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array")
    .custom((colors) => colors.every((color) => typeof color === "string"))
    .withMessage("Colors must be an array of strings"),

  priceAfterDiscount: body("priceAfterDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price after discount must be a non-negative number")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("Price after discount must be less than original price");
      }
      return true;
    }),

  ratingsAverage: body("ratingsAverage")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5")
    .custom((value) => {
      if (value !== undefined && value !== null && value !== 0 && value < 1) {
        throw new Error("Rating must be 0 or between 1 and 5");
      }
      return true;
    }),

  sold: body("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sold must be a non-negative integer"),
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
  createProduct: validationChains.create,
  updateProduct: [paramValidations.id, ...validationChains.update],
  getProductById: [paramValidations.id],
  deleteProductById: [paramValidations.id],
  getProductBySlug: [paramValidations.slug],
};
