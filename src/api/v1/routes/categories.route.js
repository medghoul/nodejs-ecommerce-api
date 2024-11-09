import { Router } from 'express';
import paginator from '#middleware/paginator.js';
import { validate } from '#middleware/validate.js';
import { categoryValidation } from '#validations/category.validation.js';
import { 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    getCategoryBySlug, 
    getCategoryById 
} from '#controllers/categories.controller.js';

const router = Router();

router.route('/')
    .get(paginator(10), getCategories)
    .post(validate(categoryValidation.createCategory), createCategory);

router.get('/slug/:slug', getCategoryBySlug);

router.route('/:id')
    .get(getCategoryById)
    .put(validate(categoryValidation.updateCategory), updateCategory)
    .delete(deleteCategory);

export default router;