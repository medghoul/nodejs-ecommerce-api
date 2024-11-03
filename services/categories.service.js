import Category from '#models/category.model.js';

export const getCategories = async () => {
    const categories = await Category.find();
    return categories;
};

export default {
    getCategories
};