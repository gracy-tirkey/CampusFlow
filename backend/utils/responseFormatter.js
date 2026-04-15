/**
 * Standardized API Response Formatter
 * All APIs should return responses in this format for consistency
 */

/**
 * Success Response
 * @param {any} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Formatted success response
 */
export const successResponse = (
  data,
  message = "Success",
  statusCode = 200,
) => {
  return {
    success: true,
    status: statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Error Response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {Object} errors - Detailed error information (optional)
 * @returns {Object} Formatted error response
 */
export const errorResponse = (message, statusCode = 400, errors = null) => {
  return {
    success: false,
    status: statusCode,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Paginated Response
 * @param {Array} data - Array of items
 * @param {number} currentPage - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total items count
 * @param {string} message - Response message
 * @returns {Object} Formatted paginated response
 */
export const paginatedResponse = (
  data,
  currentPage = 1,
  limit = 10,
  total = 0,
  message = "Data retrieved successfully",
) => {
  const totalPages = Math.ceil(total / limit);
  return {
    success: true,
    status: 200,
    message,
    data,
    pagination: {
      currentPage,
      limit,
      total,
      totalPages,
      hasMore: currentPage < totalPages,
    },
    timestamp: new Date().toISOString(),
  };
};

/**
 * Validation Error Response
 * @param {Array} errors - Array of validation errors
 * @returns {Object} Formatted validation error response
 */
export const validationErrorResponse = (errors = []) => {
  return {
    success: false,
    status: 422,
    message: "Validation failed",
    errors,
    timestamp: new Date().toISOString(),
  };
};

export default {
  successResponse,
  errorResponse,
  paginatedResponse,
  validationErrorResponse,
};
