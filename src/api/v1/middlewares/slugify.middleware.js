import slugify from "slugify";

/**
 * Creates a middleware for generating slugs based on model type
 * @function generateSlug
 * @param {string} sourceField - Field to generate slug from ('name' or 'title')
 * @returns {Function} Express middleware that generates slug
 */
export const generateSlug = (sourceField) => (req, res, next) => {
  if (!req.body[sourceField]) {
    return next();
  }

  req.body.slug = slugify(req.body[sourceField], {
    lower: true,
    strict: true,
    trim: true,
  });

  next();
};
