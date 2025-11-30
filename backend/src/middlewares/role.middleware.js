const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const restrictTo = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          ERROR_CODES.UNAUTHORIZED.statusCode,
          "You are not authenticated",
          ERROR_CODES.UNAUTHORIZED.code,
        ),
      );
    }

    if (!allowedRoles.includes(req.user?.role)) {
      return next(
        new AppError(
          ERROR_CODES.FORBIDDEN.statusCode,
          "You do not have permission to perform this action",
          ERROR_CODES.FORBIDDEN.code,
        ),
      );
    }

    next();
  };
};

module.exports = restrictTo;
