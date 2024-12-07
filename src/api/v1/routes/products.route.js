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

const router = Router();

router
  .route("/")
  .get(paginator(10), getProducts)
  .post(
    validate(productValidation.createProduct),
    generateSlug("title"),
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
    validate(productValidation.updateProduct),
    generateSlug("title"),
    updateProduct
  )
  .delete(validate(productValidation.deleteProductById), deleteProduct);

export default router;
