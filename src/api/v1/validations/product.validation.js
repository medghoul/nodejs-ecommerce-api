import { body, param } from "express-validator";

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
const categoryIdValidation = body("categoryId")
  .notEmpty()
  .withMessage("Category ID is required")
  .isMongoId()
  .withMessage("Invalid category ID");

const subcategoryIdValidation = body("subcategoryId")
  .notEmpty()
  .withMessage("Subcategory ID is required")
  .isMongoId()
  .withMessage("Invalid subcategory ID");

const brandIdValidation = body("brandId")
  .notEmpty()
  .withMessage("Brand ID is required")
  .isMongoId()
  .withMessage("Invalid brand ID");

export default {
  createProduct: [
    titleValidation,
    descriptionValidation,
    imageCoverValidation,
    categoryIdValidation,
    subcategoryIdValidation,
    brandIdValidation,
    quantityValidation,
    priceValidation,
    colorsValidation,
    priceAfterDiscountValidation,
  ],
  updateProduct: [
    idValidation,
    optionalTitleValidation,
    descriptionValidation,
    imageCoverValidation,
    categoryIdValidation,
    subcategoryIdValidation,
    brandIdValidation,
    quantityValidation,
    priceValidation,
    colorsValidation,
    priceAfterDiscountValidation,
  ],
  getProductById: [idValidation],
  deleteProductById: [idValidation],
  getProductBySlug: [slugValidation],
};
