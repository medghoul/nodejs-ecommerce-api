import Category from '../models/category.model';

// @desc Get all categories
// @route GET /api/v1/categories
// @access Public
export async function getCategories(req, res) {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
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
        res.status(201).json(category);
    } catch (err) {
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
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// @desc Delete a category
// @route DELETE /api/v1/categories/:id
// @access Private
export async function deleteCategory(req, res) {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export default {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};