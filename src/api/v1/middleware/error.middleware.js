import Logger from "#utils/logger.js";

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  Logger.error(`Error: ${err.message}`);

  const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  };

  const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  };

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

export default globalErrorHandler;
