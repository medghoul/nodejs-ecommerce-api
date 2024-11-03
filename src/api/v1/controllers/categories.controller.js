import Category from '../models/category.model.js';
import Logger from '../../../../utils/logger.js';
import ApiResponse from '../../../../utils/apiResponse.js';
import slugify from 'slugify';
import asyncHandler from 'express-async-handler';

// @desc Get all categories
// @route GET /api/v1/categories
// @access Public
export const getCategories = asyncHandler(async (req, res) => {
    const { skip, limit, getPagingData } = req.pagination;
    
    const totalItems = await Category.countDocuments();
    const categories = await Category.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const paginatedData = getPagingData(totalItems, categories);
    
    Logger.info('Categories retrieved successfully');
    
    res.status(200).json(
        ApiResponse.success(
            200,
            'Categories retrieved successfully',
            paginatedData
        )
    );
});

// @desc Create a new category
// @route POST /api/v1/categories
// @access Private
export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    
    const slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true
    });
    
    const category = await Category.create({ 
        ...req.body,
        slug 
    });
    
    Logger.info(`New category created: ${category.name} with slug: ${category.slug}`);
    
    res.status(201).json(
        ApiResponse.success(
            201,
            'Category created successfully',
            category
        )
    );
});

// @desc Update a category
// @route PUT /api/v1/categories/:id
// @access Private
export const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    Logger.info(`Category updated: ${req.params.id}`);
    
    res.status(200).json(
        ApiResponse.success(
            200,
            'Category updated successfully',
            category
        )
    );
});

// @desc Delete a category
// @route DELETE /api/v1/categories/:id
// @access Private
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    Logger.info(`Category deleted: ${req.params.id}`);
    res.status(200).json(
        ApiResponse.success(
            200,
            'Category deleted successfully'
        )
    );
});