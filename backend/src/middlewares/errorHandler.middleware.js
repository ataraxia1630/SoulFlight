const { ApiResponse } = require('../utils/ApiResponse');
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Unexpected error';
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const params = err.params || {};

  res
    .status(statusCode)
    .json(ApiResponse.error(code, message, params, req.originalUrl));
};

module.exports = errorHandler;
