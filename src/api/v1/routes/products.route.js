import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
} from "#controllers/products.controller.js";
import paginator from "#middleware/paginator.js";
import { validate } from "#middleware/validate.js";
import productValidation from "#validations/product.validation.js";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .get(paginator(10), getProducts)
  .post(validate(productValidation.createProduct), createProduct);

router.get(
  "/:slug",
  validate(productValidation.getProductBySlug),
  getProductBySlug
);

router
  .route("/:id")
  .get(validate(productValidation.getProductById), getProductById)
  .put(validate(productValidation.updateProduct), updateProduct)
  .delete(validate(productValidation.deleteProductById), deleteProduct);

export default router;
