import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrandBySlug,
  getBrands,
  updateBrand,
} from "#controllers/brands.controller.js";
import { generateSlug } from "#middlewares/slugify.middleware.js";
import subcategoriesRoute from "#routes/subcategory.route.js";
import brandValidation from "#validations/brand.validation.js";
import { Router } from "express";
import paginator from "../middlewares/paginator.js";
import { validate } from "../middlewares/validate.js";

const router = Router();

router
  .route("/")
  .get(paginator(10), getBrands)
  .post(
    validate(brandValidation.createBrand),
    generateSlug("name"),
    createBrand
  );

router.get(
  "/slug/:slug",
  validate(brandValidation.getBrandBySlug),
  getBrandBySlug
);

router
  .route("/:id")
  .get(validate(brandValidation.getBrandById), getBrandById)
  .put(validate(brandValidation.updateBrand), updateBrand)
  .delete(validate(brandValidation.deleteBrandById), deleteBrand);

router.use("/:brandId/subcategories", subcategoriesRoute);

export default router;
