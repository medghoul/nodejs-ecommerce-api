import {
  createSubCategory,
  deleteSubCategoryById,
  filterCategoryIdFromParams,
  getSubCategories,
  getSubCategoryById,
  getSubCategoryBySlug,
  setCategoryIdToBody,
  updateSubCategoryById,
} from "#controllers/subcategory.controller.js";
import subCategoryValidation from "#validations/subcategory.validation.js";
import { Router } from "express";
import paginator from "../middlewares/paginator.js";
import { validate } from "../middlewares/validate.js";

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
