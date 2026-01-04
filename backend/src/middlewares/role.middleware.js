const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const restrictTo = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          ERROR_CODES.UNAUTHORIZED.statusCode,
          "Vui lòng đăng nhập lại để thực hiện hành động này.",
          ERROR_CODES.UNAUTHORIZED.code,
        ),
      );
    }

    if (!allowedRoles.includes(req.user?.role)) {
      return next(
        new AppError(409, "Bạn không có quyền thực hiện hành động này.", "FORBIDDEN_ACTION"),
      );
    }

    next();
  };
};

module.exports = restrictTo;
