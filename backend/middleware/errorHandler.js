import { errorResponse } from "../utils/responseFormatter.js";

/**
 * Global Error Handling Middleware
 * Should be added LAST in the middleware chain (after all routes)
 */
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.keys(err.errors).map((field) => ({
      field,
      message: err.errors[field].message,
    }));
    return res.status(422).json(errorResponse("Validation error", 422, errors));
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json(errorResponse("Invalid ID format", 400));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json(errorResponse(`${field} already exists`, 409));
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json(errorResponse("Invalid token", 401));
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json(errorResponse("Token expired", 401));
  }

  // Default error
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res
    .status(status)
    .json(
      errorResponse(
        message,
        status,
        process.env.NODE_ENV === "development" ? err : null,
      ),
    );
};

/**
 * 404 Not Found Middleware
 * Should be added before errorHandler middleware
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export default { errorHandler, notFoundHandler };
