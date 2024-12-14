// src/api/v1/middlewares/image-url.middleware.js
import config from "#config/config.js";

/**
 * Creates a mongoose schema middleware to set single image URL
 * @param {string} folder - The folder name where images are stored (e.g., 'categories', 'brands')
 * @param {string} field - The field name in the schema (e.g., 'image', 'imageCover')
 * @returns {Object} Mongoose middleware functions
 */
export const setImageUrl = (folder, field = "image") => ({
  init: function (doc) {
    if (doc[field]) {
      doc[field] = `${config.BASE_URL}/${folder}/${doc[field]}`;
    }
  },
  save: function (doc) {
    if (doc[field]) {
      doc[field] = `${config.BASE_URL}/${folder}/${doc[field]}`;
    }
  },
});

/**
 * Creates a mongoose schema middleware to set multiple image URLs
 * @param {string} folder - The folder name where images are stored
 * @param {string} field - The field name in the schema (default: 'images')
 * @returns {Object} Mongoose middleware functions
 */
export const setImagesUrl = (folder, field = "images") => ({
  init: function (doc) {
    if (doc[field]) {
      doc[field] = doc[field].map(
        (image) => `${config.BASE_URL}/${folder}/${image}`
      );
    }
  },
  save: function (doc) {
    if (doc[field]) {
      doc[field] = doc[field].map(
        (image) => `${config.BASE_URL}/${folder}/${image}`
      );
    }
  },
});
