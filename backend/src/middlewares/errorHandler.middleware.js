const ApiResponse = require("../utils/ApiResponse");
const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(
        ApiResponse.error(
          err.message,
          err.code || "APP_ERROR",
          err.statusCode,
          err.params || {},
          req.originalUrl,
        ),
      );
  }

  if (err.code && typeof err.code === "string" && err.code.startsWith("P")) {
    return res
      .status(400)
      .json(
        ApiResponse.error(
          err.meta?.cause || err.message || "Database operation failed",
          err.code,
          400,
          {},
          req.originalUrl,
        ),
      );
  }

  let statusCode = 500;
  let message = "Internal Server Error";
  let code = "INTERNAL_SERVER_ERROR";

  if (err.statusCode && typeof err.statusCode === "number") statusCode = err.statusCode;
  if (err.status && typeof err.status === "number") statusCode = err.status;
  if (err.message) message = err.message;
  if (err.code) code = err.code;

  return res
    .status(statusCode)
    .json(ApiResponse.error(message, code, statusCode, {}, req.originalUrl));
};

module.exports = errorHandler;
