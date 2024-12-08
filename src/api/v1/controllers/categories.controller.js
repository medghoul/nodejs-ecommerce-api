import Category from "#models/category.model.js";
import {
  deleteOne,
  createOne,
  getOne,
  updateOne,
  getAll,
} from "#utils/handlers.factory.js";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import ApiError from "#utils/api.error.js";
import sharp from "sharp";
import Logger from "#utils/logger.js";
import asyncHandler from "express-async-handler";

// 1- Configure the disk storage for the uploaded image
/* // @desc Configure the storage for the uploaded image
// @desc The destination folder is "uploads/categories"
// @desc The filename is a combination of the fieldname, a unique suffix, and the file extension
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/categories')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + uuidv4()
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
  },
}) */

// 2- Configure the memory storage for the uploaded image
const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check if it's an image
  if (!file.mimetype.startsWith('image')) {
    return cb(new ApiError(400, 'Only image files are allowed'), false);
  }

  // Check file size (10MB = 10 * 1024 * 1024 bytes)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return cb(new ApiError(400, 'Image size must be less than 10MB'), false);
  }

  // Allow the file to be uploaded
  cb(null, true);
};

const upload = multer({ storage: memoryStorage, fileFilter: fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })



// @desc Middleware to upload a category image
export const uploadCategoryImage = upload.single("image");

// @desc Middleware to resize the uploaded image
export const resizeCategoryImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  
  Logger.info("Resizing the uploaded image");
  const uniqueSuffix = Date.now() + '-' + uuidv4();
  const filename = req.file.fieldname + '-' + uniqueSuffix + '.' + req.file.mimetype.split('/')[1];
  const buffer = req.file.buffer;
  
  try {
    await sharp(buffer)
      .resize(600, null, {
        withoutEnlargement: true
      })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);
      
    req.body.image = filename;
    next();
  } catch (error) {
    return next(new ApiError(400, "Error processing image"));
  }
});

// @desc Middleware to delete the uploaded image
export const deleteCategoryImage = (req, res, next) => {
  const imagePath = req.file.path;
  fs.unlink(imagePath, (err) => {
    if (err) return next(err);
    next();
  });
};


// @desc Get all categories
// @route GET /api/v1/categories
// @access Public
export const getCategories = getAll(Category);

// @desc Create a new category
// @route POST /api/v1/categories
// @access Private
export const createCategory = createOne(Category);


// @desc Update a category
// @route PUT /api/v1/categories/:id
// @access Private
export const updateCategory = updateOne(Category);

// @desc Delete a category
// @route DELETE /api/v1/categories/:id
// @access Private
export const deleteCategory = deleteOne(Category);


// @desc Get a category by slug
// @route GET /api/v1/categories/:slug
// @access Public
export const getCategoryBySlug = getOne(Category, "slug");

// @desc Get a category by id
// @route GET /api/v1/categories/:id
// @access Public
export const getCategoryById = getOne(Category);

