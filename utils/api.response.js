/**
 * Class representing an API response
 * @class ApiResponse
 */
class ApiResponse {
  /**
   * Creates an instance of ApiResponse
   * @param {boolean} success - Indicates if the request was successful
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {*} [data=null] - Response payload data
   */
  constructor(success, statusCode, message, data = null) {
    /** @private */
    this.success = success;
    /** @private */
    this.statusCode = statusCode;
    /** @private */
    this.message = message;
    /** @private */
    this.data = data;
    /** @private */
    this.timestamp = new Date().toISOString();
  }

  /**
   * Creates a success response
   * @static
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {*} [data] - Response payload data
   * @returns {ApiResponse} Success response instance
   */
  static success(statusCode, message, data) {
    return new ApiResponse(true, statusCode, message, data);
  }

  /**
   * Creates an error response
   * @static
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @returns {ApiResponse} Error response instance
   */
  static error(statusCode, message) {
    return new ApiResponse(false, statusCode, message);
  }
}

export default ApiResponse;
