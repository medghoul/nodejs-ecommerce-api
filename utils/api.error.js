/**
 * Class representing an operational API error
 * @class ApiError
 * @extends Error
 */
class ApiError extends Error {
  /**
   * Creates an instance of ApiError
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   */
  constructor(statusCode, message) {
    super(message);

    /** @private */
    this.statusCode = statusCode;

    /**
     * @private
     * Status type based on status code (fail for 4xx, error for 5xx)
     *
     */
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    /** @private */
    this.isOperational = true;
  }
}

export default ApiError;
