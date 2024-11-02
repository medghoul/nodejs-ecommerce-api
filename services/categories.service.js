import Category from '../src/models/categoryModel';

export const getCategories = async () => {
    const categories = await Category.find();
    return categories;
};

export default {
    getCategories
};