const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    status: err.status || 'error',
    statusCode,
    message,
  });
};

module.exports = errorHandler;
