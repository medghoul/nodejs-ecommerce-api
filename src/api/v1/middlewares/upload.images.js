import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import multer from "multer";
import ApiError from "#utils/api.error.js";
import Logger from "#utils/logger.js";
import fs from "fs/promises";
import path from "path";

/**
 * Memory storage configuration for multer
 * Stores files in memory as Buffer objects
 */
const multerStorage = multer.memoryStorage();

/**
 * File filter configuration for multer
 * Only allows image files to be uploaded
 * @param {Object} req - Express request object
 * @param {Object} file - File object from multer
 * @param {Function} cb - Callback function
 */
const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    return cb(new ApiError(400, "Only image files are allowed"), false);
  }
  cb(null, true);
};

/**
 * Multer upload configuration
 * Sets storage, file filter and file size limit
 */
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * Creates a middleware for uploading a single image
 * @function uploadSingleImage
 * @param {string} fieldName - Name of the field in the form
 * @returns {Function} Express middleware that handles single image upload
 */
export const uploadSingleImage = (fieldName) => upload.single(fieldName);

/**
 * Creates a middleware for uploading multiple images
 * @function uploadMultipleImages
 * @param {string} fieldName - Name of the field in the form
 * @param {number} maxCount - Maximum number of files to accept
 * @returns {Function} Express middleware that handles multiple image upload
 */
export const uploadMultipleImages = (fieldName, maxCount) =>
  upload.array(fieldName, maxCount);

/**
 * Creates a middleware for uploading mixed images with different field names
 * @function uploadMixedImages
 * @param {Array<Object>} fields - Array of objects with name and maxCount
 * @returns {Function} Express middleware that handles mixed image upload
 */
export const uploadMixedImages = (fields) => upload.fields(fields);

/**
 * Creates a middleware for processing and resizing a single image
 * @function resizeImage
 * @param {string} folder - Destination folder for the processed image
 * @param {number} [width=null] - Target width of the image
 * @param {number} [height=null] - Target height of the image
 * @returns {Function} Express middleware that processes single image
 * @throws {ApiError} If image processing fails
 */
export const resizeImage = (folder, width = null, height = null) =>
  asyncHandler(async (req, res, next) => {
    if (!req.file) return next();

    const filename = `${req.file.fieldname}-${Date.now()}-${uuidv4()}.jpeg`;
    const uploadPath = `uploads/${folder}`;

    try {
      // Ensure upload directory exists
      await fs.mkdir(uploadPath, { recursive: true });

      const sharpInstance = sharp(req.file.buffer)
        .resize(width, height, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toFormat("jpeg")
        .jpeg({ quality: 90 });

      Logger.info(`Processing image: ${filename} in folder: ${folder}`);

      await sharpInstance.toFile(`${uploadPath}/${filename}`);

      req.body.image = filename;
      next();
    } catch (error) {
      Logger.error("Error processing image:", error);
      return next(new ApiError(400, "Error processing image"));
    }
  });

/**
 * Creates a middleware for processing and resizing multiple images
 * @function resizeMultipleImages
 * @param {string} folder - Destination folder for the processed images
 * @param {number} [width=null] - Target width of the images
 * @param {number} [height=null] - Target height of the images
 * @returns {Function} Express middleware that processes multiple images
 * @throws {ApiError} If image processing fails
 */
export const resizeMultipleImages = (folder, width = null, height = null) =>
  asyncHandler(async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();

    req.body.images = [];

    await Promise.all(
      req.files.map(async (file) => {
        const filename = `${file.fieldname}-${Date.now()}-${uuidv4()}.jpeg`;

        try {
          await sharp(file.buffer)
            .resize(width, height, {
              withoutEnlargement: true,
              fit: "contain",
            })
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/${folder}/${filename}`);

          req.body.images.push(filename);
        } catch (error) {
          Logger.error("Error processing image:", error);
          throw new ApiError(400, "Error processing image");
        }
      })
    );

    next();
  });
