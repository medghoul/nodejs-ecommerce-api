import { Router } from 'express';
const router = Router();
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categories.controller.js';

router.route('/').get(getCategories).post(createCategory);
router.route('/:id').put(updateCategory).delete(deleteCategory);

export default router;