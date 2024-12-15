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
  resizeMixedImages,
  uploadMixedImages,
} from "#middlewares/upload.images.js";
const router = Router();

router
  .route("/")
  .get(paginator(10), getProducts)
  .post(
    uploadMixedImages([
      {
        name: "imageCover",
        maxCount: 1,
      },
      {
        name: "images",
        maxCount: 5,
      },
    ]),
    validate(productValidation.createProduct),
    generateSlug("title"),
    resizeMixedImages("products", 600, 600),
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
    uploadMixedImages([
      {
        name: "imageCover",
        maxCount: 1,
      },
      {
        name: "images",
        maxCount: 5,
      },
    ]),
    validate(productValidation.updateProduct),
    generateSlug("title"),
    resizeMixedImages("products", 600, 600),
    updateProduct
  )
  .delete(validate(productValidation.deleteProductById), deleteProduct);

export default router;
