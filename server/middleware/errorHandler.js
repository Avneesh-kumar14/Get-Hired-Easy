/**
 * Global Error Handler Middleware
 * Sanitizes errors before sending to client - never expose internal details
 */

export const errorHandler = (err, req, res, next) => {
  // Log full error internally for debugging
  console.error("Error Details:", {
    message: err.message,
    code: err.code,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  // Sanitize error before sending to client
  const statusCode = err.statusCode || 500;

  // MongoDB Errors - Never expose internal DB errors
  if (err.name === "MongoError" || err.code === 11000) {
    return res.status(400).json({
      message: "Database operation failed. Please try again.",
      success: false,
    });
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid authentication token.",
      success: false,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Authentication token expired. Please login again.",
      success: false,
    });
  }

  // Validation Errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Invalid data provided.",
      success: false,
    });
  }

  // Multer file upload errors
  if (err.name === "MulterError") {
    let message = "File upload failed.";
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size exceeds maximum limit.";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message = "Too many files uploaded.";
    }
    return res.status(400).json({
      message,
      success: false,
    });
  }

  // File validation errors
  if (err.message && err.message.includes("Invalid file type")) {
    return res.status(400).json({
      message: err.message,
      success: false,
    });
  }

  // Rate limit errors
  if (statusCode === 429) {
    return res.status(429).json({
      message: "Too many requests. Please try again later.",
      success: false,
    });
  }

  // CORS errors
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({
      message: "Access denied.",
      success: false,
    });
  }

  // Generic error - never expose internals
  return res.status(statusCode).json({
    message: "Something went wrong. Please try again later.",
    success: false,
  });
};

/**
 * Async error wrapper
 * Wrap async route handlers to catch errors automatically
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default errorHandler;
