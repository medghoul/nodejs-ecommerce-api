import { body, param } from "express-validator";
import mongoose from "mongoose";
import Category from "#models/category.model.js";
import Brand from "#models/brand.model.js";
import Subcategory from "#models/subcategory.model.js";
// Common validation rules
const titleValidation = body("title")
  .trim()
  .notEmpty()
  .withMessage("Product title is required")
  .isLength({ min: 3 })
  .withMessage("Title must be at least 3 characters long")
  .isLength({ max: 32 })
  .withMessage("Title cannot be longer than 32 characters");

const descriptionValidation = body("description")
  .trim()
  .notEmpty()
  .withMessage("Product description is required")
  .isLength({ min: 10 })
  .withMessage("Description must be at least 10 characters long")
  .isLength({ max: 2000 })
  .withMessage("Description cannot be longer than 2000 characters");

const quantityValidation = body("quantity")
  .notEmpty()
  .withMessage("Product quantity is required")
  .isInt({ min: 1 })
  .withMessage("Quantity must be a positive integer");

const soldValidation = body("sold")
  .optional()
  .isInt({ min: 0 })
  .withMessage("Sold must be a non-negative integer")
  .isNumeric()
  .withMessage("Sold must be a number");

const priceValidation = body("price")
  .notEmpty()
  .withMessage("Product price is required")
  .isFloat({ min: 0 })
  .withMessage("Price must be a non-negative number")
  .isNumeric()
  .withMessage("Price must be a number");

const colorsValidation = body("colors")
  .optional()
  .isArray()
  .withMessage("Colors must be an array")
  .custom((colors) => colors.every((color) => typeof color === "string"))
  .withMessage("Colors must be an array of strings")
  .isLength({ max: 32 })
  .withMessage("Colors cannot be longer than 32 characters");

const priceAfterDiscountValidation = body("priceAfterDiscount")
  .optional()
  .isFloat({ min: 0 })
  .withMessage("Price after discount must be a non-negative number")
  .isNumeric()
  .withMessage("Price after discount must be a number")
  .custom((value, { req }) => {
    if (!req.body.price || req.body.price <= value) {
      throw new Error(
        "Original price is required to calculate price after discount"
      );
    }
    if (
      req.body.priceAfterDiscount &&
      req.body.priceAfterDiscount >= req.body.price
    ) {
      throw new Error(
        "Price after discount cannot be greater than or equal to the original price"
      );
    }
    return true;
  });

const optionalTitleValidation = body("title")
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Product title cannot be empty")
  .isLength({ min: 3 })
  .withMessage("Title must be at least 3 characters long")
  .isLength({ max: 32 })
  .withMessage("Title cannot be longer than 32 characters");

const imageCoverValidation = body("imageCover")
  .notEmpty()
  .withMessage("Image cover is required");

const idValidation = param("id")
  .notEmpty()
  .withMessage("Product ID is required")
  .isMongoId()
  .withMessage("Invalid product ID");

const slugValidation = param("slug")
  .trim()
  .notEmpty()
  .withMessage("Slug is required")
  .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .withMessage("Invalid slug format");

// Validation rules for product
const categoryValidation = body("category")
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
  });

const subcategoriesValidation = body("subcategories")
  .optional()
  .isArray()
  .withMessage("Subcategories must be an array")
  .custom(async (subcategoriesIds) => {
    // Verify if all IDs are valid MongoDB ObjectIds
    const isValidIds = subcategoriesIds.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (!isValidIds) {
      throw new Error("Invalid subcategory ID format");
    }

    const subcategories = await Subcategory.find({
      _id: { $in: subcategoriesIds },
    });

    // Verify if all IDs are valid MongoDB ObjectIds
    const foundIds = subcategories.map((sub) => sub._id.toString());
    const notFoundIds = subcategoriesIds.filter(
      (id) => !foundIds.includes(id.toString())
    );

    if (notFoundIds.length > 0) {
      throw new Error(
        `Subcategories with IDs ${notFoundIds.join(", ")} do not exist`
      );
    }

    return true;
  });

const brandValidation = body("brand")
  .optional()
  .isMongoId()
  .withMessage("Invalid brand ID")
  .custom(async (brandId) => {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      throw new Error(`Brand with ID ${brandId} not exists`);
    }
    return true;
  });

const ratingsAverageValidation = body("ratingsAverage")
  .optional({ nullable: true })
  .isFloat({ min: 0, max: 5 })
  .withMessage("Rating must be between 0 and 5")
  .custom((value) => {
    if (value !== undefined && value !== null && value !== 0 && value < 1) {
      throw new Error("Rating must be 0 or between 1 and 5");
    }
    return true;
  });

const createValidationRule = (validationRule, isUpdate = false) => {
  return isUpdate ? validationRule.optional() : validationRule;
};

const createProductValidations = (isUpdate = false) => [
  createValidationRule(titleValidation, isUpdate),
  createValidationRule(descriptionValidation, isUpdate),
  createValidationRule(imageCoverValidation, isUpdate),
  createValidationRule(categoryValidation, isUpdate),
  createValidationRule(subcategoriesValidation, isUpdate),
  createValidationRule(brandValidation, isUpdate),
  createValidationRule(quantityValidation, isUpdate),
  createValidationRule(priceValidation, isUpdate),
  createValidationRule(colorsValidation, isUpdate),
  createValidationRule(priceAfterDiscountValidation, isUpdate),
  createValidationRule(ratingsAverageValidation, isUpdate),
  createValidationRule(soldValidation, isUpdate),
];

export default {
  createProduct: createProductValidations(false),
  updateProduct: [idValidation, ...createProductValidations(true)],
  getProductById: [idValidation],
  deleteProductById: [idValidation],
  getProductBySlug: [slugValidation],
};
