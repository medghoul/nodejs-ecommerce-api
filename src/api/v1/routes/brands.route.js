import {
  createBrand,
  deleteBrand,
  getBrands,
  getBrandById,
  getBrandBySlug,
  updateBrand,
} from "#controllers/brands.controller.js";
import paginator from "#middleware/paginator.js";
import { validate } from "#middleware/validate.js";
import brandValidation from "#validations/brand.validation.js";
import { Router } from "express";
import subcategoriesRoute from "#routes/subcategory.route.js";

const router = Router();

router
  .route("/")
  .get(paginator(10), getBrands)
  .post(validate(brandValidation.createBrand), createBrand);

router.get("/:slug", validate(brandValidation.getBrandBySlug), getBrandBySlug);

router
  .route("/:id")
  .get(validate(brandValidation.getBrandById), getBrandById)
  .put(validate(brandValidation.updateBrand), updateBrand)
  .delete(validate(brandValidation.deleteBrandById), deleteBrand);

router.use("/:brandId/subcategories", subcategoriesRoute);

export default router;
