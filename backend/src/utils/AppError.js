class AppError extends Error {
  constructor(statusCode, message, code, params = {}) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.code = code;
    this.params = params;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
