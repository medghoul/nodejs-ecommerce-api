import Category from '../models/category.model.js';
import Logger from '../../../../utils/logger.js';
import ApiResponse from '../../../../utils/apiResponse.js';

// @desc Get all categories
// @route GET /api/v1/categories
// @access Public
export async function getCategories(req, res, next) {
    try {
        const categories = await Category.find();
        Logger.info('Categories retrieved successfully');
        
        return res.status(200).json(
            ApiResponse.success(
                200,
                'Categories retrieved successfully',
                categories
            )
        );
    } catch (err) {
        Logger.error(`Error retrieving categories: ${err.message}`);
        next(err);
    }
}

// @desc Create a new category
// @route POST /api/v1/categories
// @access Private
export async function createCategory(req, res, next) {
    try {
        const category = await Category.create(req.body);
        Logger.info(`New category created: ${category.name}`);
        
        return res.status(201).json(
            ApiResponse.success(
                201,
                'Category created successfully',
                category
            )
        );
    } catch (err) {
        Logger.error(`Error creating category: ${err.message}`);
        next(err);
    }
}

// @desc Update a category
// @route PUT /api/v1/categories/:id
// @access Private
export async function updateCategory(req, res, next) {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json(
                ApiResponse.error(404, 'Category not found')
            );
        }

        Logger.info(`Category updated: ${req.params.id}`);
        
        return res.status(200).json(
            ApiResponse.success(
                200,
                'Category updated successfully',
                category
            )
        );
    } catch (err) {
        Logger.error(`Error updating category: ${err.message}`);
        next(err);
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