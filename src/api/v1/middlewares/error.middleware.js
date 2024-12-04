import Logger from "#utils/logger.js";
import ApiResponse from "#utils/api.response.js";

const handleMongooseErrors = (err) => {
  if (err.name === "CastError") {
    return { statusCode: 400, message: "Invalid ID format" };
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
    return { statusCode: 400, message: messages };
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return {
      statusCode: 409,
      message: `Duplicate ${field} value. Please use another value`,
    };
  }

  return null;
};

const globalErrorHandler = (err, req, res, next) => {
  Logger.error(`Error: ${err.message}`);

  const mongooseError = handleMongooseErrors(err);

  const statusCode = mongooseError?.statusCode || err.statusCode || 500;
  const message =
    mongooseError?.message || err.message || "Internal server error";

  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      status: err.status,
      message,
      error: err,
      stack: err.stack,
    });
  }

  return res.status(statusCode).json(ApiResponse.error(statusCode, message));
};

export default globalErrorHandler;
