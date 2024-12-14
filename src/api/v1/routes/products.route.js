import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  getProducts,
  updateProduct,
} from "#controllers/products.controller.js";
import productValidation from "#validations/product.validation.js";
import { Router } from "express";
import paginator from "../middlewares/paginator.js";
import { validate } from "../middlewares/validate.js";
import { generateSlug } from "#middlewares/slugify.middleware.js";
import {
  resizeImage,
  resizeMultipleImages,
  uploadMultipleImages,
  uploadSingleImage,
} from "#middlewares/upload.images.js";

const router = Router();

router
  .route("/")
  .get(paginator(10), getProducts)
  .post(
    uploadMultipleImages("images", 5),
    uploadSingleImage("imageCover"),
    validate(productValidation.createProduct),
    generateSlug("title"),
    resizeImage("products", 600, 600),
    resizeMultipleImages("products", 600, 600),
    createProduct
  );

router.get(
  "/slug/:slug",
  validate(productValidation.getProductBySlug),
  getProductBySlug
);

router
  .route("/:id")
  .get(validate(productValidation.getProductById), getProductById)
  .put(
    uploadMultipleImages("images", 5),
    uploadSingleImage("imageCover"),
    validate(productValidation.updateProduct),
    generateSlug("title"),
    resizeImage("products", 600, 600),
    resizeMultipleImages("products", 600, 600),
    updateProduct
  )
  .delete(validate(productValidation.deleteProductById), deleteProduct);

export default router;
