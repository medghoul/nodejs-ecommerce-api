import { Router } from 'express';
import paginator from '#middleware/paginator.js'
const router = Router();
import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryBySlug, getCategoryById } from '#controllers/categories.controller.js';

router.route('/')
    .get(paginator(10), getCategories)
    .post(createCategory);

router.get('/slug/:slug', getCategoryBySlug);

router.route('/:id')
    .get(getCategoryById)
    .put(updateCategory)
    .delete(deleteCategory);

export default router;