import { Router } from 'express';
import paginator from '#middleware/paginator.js'
const router = Router();
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categories.controller.js';

router.route('/')
    .get(paginator(10), getCategories)
    .post(createCategory);

router.route('/:id')
    .put(updateCategory)
    .delete(deleteCategory);

export default router;