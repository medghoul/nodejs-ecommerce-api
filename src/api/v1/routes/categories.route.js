import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
} from "#controllers/categories.controller.js";
import paginator from "#middlewares/paginator.js";
import { validate } from "#middlewares/validate.js";
import categoryValidation from "#validations/category.validation.js";
import { Router } from "express";
import subcategoriesRoute from "#routes/subcategory.route.js";
import { generateSlug } from "#middlewares/slugify.middleware.js";
const router = Router();

router
  .route("/")
  .get(paginator(10), getCategories)
  .post(
    validate(categoryValidation.createCategory),
    generateSlug("name"),
    createCategory
  );

router.get(
  "/slug/:slug",
  validate(categoryValidation.getCategoryBySlug),
  getCategoryBySlug
);

router
  .route("/:id")
  .get(validate(categoryValidation.getCategoryById), getCategoryById)
  .put(
    validate(categoryValidation.updateCategory),
    generateSlug("name"),
    updateCategory
  )
  .delete(validate(categoryValidation.deleteCategoryById), deleteCategory);

router.use("/:categoryId/subcategories", subcategoriesRoute);

export default router;
