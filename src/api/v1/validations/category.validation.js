import { body, param } from 'express-validator';

export const categoryValidation = {
    createCategory: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Category name is required')
            .isLength({ min: 3 })
            .withMessage('Name must be at least 3 characters long')
            .isLength({ max: 32 })
            .withMessage('Name cannot be longer than 32 characters'),
        body('image')
            .optional()
            .isURL()
            .withMessage('Image must be a valid URL')
    ],

    updateCategory: [
        param('id')
            .notEmpty()
            .withMessage('Category ID is required')
            .isMongoId()
            .withMessage('Invalid category ID'),
        body('name')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Category name cannot be empty')
            .isLength({ min: 3 })
            .withMessage('Name must be at least 3 characters long')
            .isLength({ max: 32 })
            .withMessage('Name cannot be longer than 32 characters'),
        body('image')
            .optional()
            .isURL()
            .withMessage('Image must be a valid URL')
    ]
};
