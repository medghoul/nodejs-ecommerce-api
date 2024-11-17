import { Router } from "express";
import { validate } from "#middleware/validate.js";
import subCategoryValidation from "#validations/subcategory.validation.js";
import paginator from "#middleware/paginator.js";
import {
  createSubCategory,
  getSubCategoryBySlug,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById,
  getSubCategories,
  setCategoryIdToBody,
  filterCategoryIdFromParams,
} from "#controllers/subcategory.controller.js";

// Create router with mergeParams option
const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    setCategoryIdToBody,
    validate(subCategoryValidation.createSubCategory),
    createSubCategory
  )
  .get(filterCategoryIdFromParams, paginator(10), getSubCategories);

router.get(
  "/slug/:slug",
  validate(subCategoryValidation.getSubCategoryBySlug),
  getSubCategoryBySlug
);

router
  .route("/:id")
  .get(validate(subCategoryValidation.getSubCategoryById), getSubCategoryById)
  .put(validate(subCategoryValidation.updateSubCategory), updateSubCategoryById)
  .delete(
    validate(subCategoryValidation.deleteSubCategoryById),
    deleteSubCategoryById
  );

export default router;
