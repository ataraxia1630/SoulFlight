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
      return next(error);
    }

    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
