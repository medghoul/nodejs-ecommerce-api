import Category from '../models/category.model.js';
import Logger from '../../../../utils/logger.js';

// @desc Get all categories
// @route GET /api/v1/categories
// @access Public
export async function getCategories(req, res) {
    try {
        const categories = await Category.find();
        Logger.info('Categories retrieved successfully');
        res.status(200).json(categories);
    } catch (err) {
        Logger.error(`Error retrieving categories: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
}

// @desc Create a new category
// @route POST /api/v1/categories
// @access Private
export async function createCategory(req, res) {
    const { name } = req.body;
    try {
        const category = await Category.create({ name });
        Logger.info(`New category created: ${name}`);
        res.status(201).json(category);
    } catch (err) {
        Logger.error(`Error creating category: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
}

// @desc Update a category
// @route PUT /api/v1/categories/:id
// @access Private
export async function updateCategory(req, res) {
    const { name } = req.body;
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
        Logger.info(`Category updated: ${req.params.id}`);
        res.status(200).json(category);
    } catch (err) {
        Logger.error(`Error updating category: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
}

// @desc Delete a category
// @route DELETE /api/v1/categories/:id
// @access Private
export async function deleteCategory(req, res) {
    try {
        await Category.findByIdAndDelete(req.params.id);
        Logger.info(`Category deleted: ${req.params.id}`);
        res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        Logger.error(`Error deleting category: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
}

export default {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};