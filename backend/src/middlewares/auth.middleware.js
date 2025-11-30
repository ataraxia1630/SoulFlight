const { AuthService } = require("../services/auth.service");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const authMiddleware = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        new AppError(
          ERROR_CODES.UNAUTHORIZED.statusCode,
          ERROR_CODES.UNAUTHORIZED.message,
          ERROR_CODES.UNAUTHORIZED.code,
        ),
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(
        new AppError(
          ERROR_CODES.UNAUTHORIZED.statusCode,
          ERROR_CODES.UNAUTHORIZED.message,
          ERROR_CODES.UNAUTHORIZED.code,
        ),
      );
    }

    let payload;
    try {
      payload = await AuthService.verifyAccessToken(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(
          new AppError(401, "Token đã hết hạn. Vui lòng đăng nhập lại.", "TOKEN_EXPIRED"),
        );
      }
      if (error.name === "JsonWebTokenError") {
        return next(new AppError(401, "Token không hợp lệ.", "INVALID_TOKEN"));
      }
      return next(new AppError(401, "Xác thực thất bại.", "AUTH_FAILED"));
    }

    req.user = payload;

    next();
  } catch (_error) {
    next(new AppError(500, "Lỗi hệ thống xác thực", "AUTH_SYSTEM_ERROR"));
  }
};

module.exports = authMiddleware;
