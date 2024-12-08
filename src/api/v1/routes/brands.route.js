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
import paginator from "#middlewares/paginator.js";
import { validate } from "#middlewares/validate.js";
import { uploadSingleImage, resizeImage } from "#middlewares/upload.images.js";
const router = Router();

router
  .route("/")
  .get(paginator(10), getBrands)
  .post(
    uploadSingleImage("image"),
    validate(brandValidation.createBrand),
    generateSlug("name"),
    resizeImage("brands", 600, 600),
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
  .put(validate(brandValidation.updateBrand), generateSlug("name"), updateBrand)
  .delete(validate(brandValidation.deleteBrandById), deleteBrand);

router.use("/:brandId/subcategories", subcategoriesRoute);

export default router;
