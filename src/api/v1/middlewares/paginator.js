import ApiResponse from "#utils/api.response.js";

/**
 * Creates a pagination middleware
 * @param {number} defaultItemsPerPage - Default number of items per page
 * @returns {Function} Express middleware function
 */
const paginator =
  (defaultItemsPerPage = 10) =>
  /**
   * Express middleware that adds pagination utilities to the request object
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @param {import('express').NextFunction} next - Express next function
   * @returns {void}
   */
  (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || defaultItemsPerPage;

    if (page < 1 || limit < 1) {
      return res
        .status(400)
        .json(
          ApiResponse.error(400, "Page and limit must be positive numbers")
        );
    }

    const skip = (page - 1) * limit;

    /**
     * @typedef {Object} PaginationInfo
     * @property {number} page - Current page number
     * @property {number} limit - Items per page
     * @property {number} skip - Number of items to skip
     * @property {Function} getPagingData - Function to generate pagination metadata
     */

    /**
     * Pagination utility object added to request
     * @type {PaginationInfo}
     */
    req.pagination = {
      page,
      limit,
      skip,
      /**
       * Generates pagination metadata
       * @param {number} totalItems - Total number of items across all pages
       * @param {Array} items - Current page items
       * @returns {Object} Pagination metadata with items
       */
      getPagingData: (totalItems, items) => ({
        totalItems,
        items,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: limit,
        hasNextPage: page * limit < totalItems,
        hasPreviousPage: page > 1,
      }),
    };

    next();
  };

export default paginator;
