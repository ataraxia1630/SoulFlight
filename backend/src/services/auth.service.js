const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const redis = require("../configs/redis");
const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const OTP_DIGITS = Number(process.env.OTP_DIGITS || 5);
const OTP_EXPIRE_MIN = Number(process.env.OTP_EXPIRE_MIN || 5);
const OTP_RESEND_LIMIT = Number(process.env.OTP_RESEND_LIMIT || 5);
const OTP_RESEND_WINDOW_MIN = Number(process.env.OTP_RESEND_WINDOW_MIN || 60);
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

// helpers: jwt sign
const signAccessToken = (payload, expires = "10d") =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expires });

const signRefreshToken = (payload, expires = "30d") =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: expires });

// store single refresh token per user-device (simple). For multi-device, store as set.
const storeRefreshToken = async (userId, token, ttlSeconds) => {
  await redis.set(`refresh:${userId}`, token, "EX", ttlSeconds);
};

const revokeRefreshToken = async (userId) => {
  await redis.del(`refresh:${userId}`);
};

const getStoredRefreshToken = async (userId) => {
  return await redis.get(`refresh:${userId}`);
};

const AuthService = {
  _generateOtp: () => {
    const min = 10 ** (OTP_DIGITS - 1);
    const max = 10 ** OTP_DIGITS - 1;
    return String(Math.floor(min + Math.random() * (max - min + 1)));
  },

  sendOtp: async (email) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      throw new AppError(
        ERROR_CODES.EMAIL_REGISTERED.statusCode,
        ERROR_CODES.EMAIL_REGISTERED.message,
        ERROR_CODES.EMAIL_REGISTERED.code,
      );

    const otp = AuthService._generateOtp();
    const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);
    await redis.set(`otp:${email}`, hashedOtp, "EX", 60 * OTP_EXPIRE_MIN);
    await redis.del(`otp_resend:${email}`);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Mã OTP Đăng Ký SoulFlight",
      html: `<p>Xin chào!</p><p>Mã OTP: <strong>${otp}</strong></p><p>Hết hạn sau 5 phút.</p><p>Trân trọng,<br>SoulFlight</p>`,
    };
    await transporter.sendMail(mailOptions);

    return { message: "OTP sent" };
  },

  resendOtp: async (email) => {
    const key = `otp_resend:${email}`;
    const current = await redis.get(key);
    if (current && Number(current) >= OTP_RESEND_LIMIT) {
      throw new AppError(
        ERROR_CODES.OTP_LIMIT_EXCEEDED.statusCode,
        ERROR_CODES.OTP_LIMIT_EXCEEDED.message,
        ERROR_CODES.OTP_LIMIT_EXCEEDED.code,
        { limit: OTP_RESEND_LIMIT, resend_after: OTP_RESEND_WINDOW_MIN },
      );
    }

    const added = await redis.incr(key);
    if (added === 1) {
      await redis.expire(key, 60 * OTP_RESEND_WINDOW_MIN);
    }

    await redis.del(`otp:${email}`);
    return await AuthService.sendOtp(email);
  },

  verifyOtp: async (email, otp) => {
    const hashedOtp = await redis.get(`otp:${email}`);
    if (!hashedOtp)
      throw new AppError(
        ERROR_CODES.OTP_EXPIRED.statusCode,
        ERROR_CODES.OTP_EXPIRED.message,
        ERROR_CODES.OTP_EXPIRED.code,
      );
    const isValid = await bcrypt.compare(otp, hashedOtp);
    if (!isValid)
      throw new AppError(
        ERROR_CODES.OTP_INVALID.statusCode,
        ERROR_CODES.OTP_INVALID.message,
        ERROR_CODES.OTP_INVALID.code,
      );
    await redis.del(`otp:${email}`);
    const verify_token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    return verify_token;
  },

  createUser: async (data) => {
    const { email, username, password, role, verify_token } = data;
    let decoded;
    try {
      decoded = jwt.verify(verify_token, process.env.JWT_SECRET);
    } catch (_err) {
      throw new AppError(
        ERROR_CODES.INVALID_VERIFICATION_TOKEN.statusCode,
        ERROR_CODES.INVALID_VERIFICATION_TOKEN.message,
        ERROR_CODES.INVALID_VERIFICATION_TOKEN.code,
      );
    }
    if (decoded.email !== email)
      throw new AppError(
        ERROR_CODES.EMAIL_MISMATCH.statusCode,
        ERROR_CODES.EMAIL_MISMATCH.message,
        ERROR_CODES.EMAIL_MISMATCH.code,
      );

    let existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      throw new AppError(
        ERROR_CODES.EMAIL_REGISTERED.statusCode,
        ERROR_CODES.EMAIL_REGISTERED.message,
        ERROR_CODES.EMAIL_REGISTERED.code,
      );
    existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser)
      throw new AppError(
        ERROR_CODES.USERNAME_TAKEN.statusCode,
        ERROR_CODES.USERNAME_TAKEN.message,
        ERROR_CODES.USERNAME_TAKEN.code,
      );

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email,
        name: username,
        username,
        password: password_hash,
        status: role === "TRAVELER" ? "ACTIVE" : "UNVERIFIED",
      },
    });
    return user;
  },

  createTraveler: async (data) => {
    const { email, phone, ...travelerData } = data;

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email },
        include: {
          Traveler: true,
          Provider: true,
        },
      });
      if (!user)
        throw new AppError(
          ERROR_CODES.USER_NOT_FOUND.statusCode,
          ERROR_CODES.USER_NOT_FOUND.message,
          ERROR_CODES.USER_NOT_FOUND.code,
        );
      if (user.Traveler?.length > 0)
        throw new AppError(
          ERROR_CODES.PROFILE_ALREADY_EXISTS.statusCode,
          ERROR_CODES.PROFILE_ALREADY_EXISTS.message,
          ERROR_CODES.PROFILE_ALREADY_EXISTS.code,
        );
      if (user.Provider?.length > 0)
        throw new AppError(
          ERROR_CODES.PROFILE_ALREADY_EXISTS.statusCode,
          "User is already registered as a provider",
          ERROR_CODES.PROFILE_ALREADY_EXISTS.code,
        );

      if (phone) {
        const existingUser = await tx.user.findUnique({ where: { phone } });
        if (existingUser)
          throw new AppError(
            ERROR_CODES.PHONE_REGISTERED.statusCode,
            ERROR_CODES.PHONE_REGISTERED.message,
            ERROR_CODES.PHONE_REGISTERED.code,
          );
        await tx.user.update({
          where: { email },
          data: { phone },
        });
      }

      await tx.traveler.create({
        data: {
          id: user.id,
          ...travelerData,
        },
      });
      return user;
    });
  },

  createProvider: async (data) => {
    const { email, phone, name, ...providerData } = data;

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { email },
        include: { Provider: true, Traveler: true },
      });
      if (!user)
        throw new AppError(
          ERROR_CODES.USER_NOT_FOUND.statusCode,
          ERROR_CODES.USER_NOT_FOUND.message,
          ERROR_CODES.USER_NOT_FOUND.code,
        );
      if (user.Provider?.length > 0)
        throw new AppError(
          ERROR_CODES.PROFILE_ALREADY_EXISTS.statusCode,
          ERROR_CODES.PROFILE_ALREADY_EXISTS.message,
          ERROR_CODES.PROFILE_ALREADY_EXISTS.code,
        );
      if (user.Traveler?.length > 0)
        throw new AppError(
          ERROR_CODES.PROFILE_ALREADY_EXISTS.statusCode,
          "User is already registered as a traveler",
          ERROR_CODES.PROFILE_ALREADY_EXISTS.code,
        );

      if (phone) {
        const existingUser = await tx.user.findUnique({ where: { phone } });
        if (existingUser)
          throw new AppError(
            ERROR_CODES.PHONE_REGISTERED.statusCode,
            ERROR_CODES.PHONE_REGISTERED.message,
            ERROR_CODES.PHONE_REGISTERED.code,
          );
        await tx.user.update({
          where: { id: user.id },
          data: { phone },
        });
      }

      if (name) {
        await tx.user.update({
          where: { id: user.id },
          data: { name },
        });
      }

      await tx.provider.create({
        data: {
          id: user.id,
          ...providerData,
        },
      });
      return user;
    });
  },

  login: async (username, password, remember = false) => {
    let existingUser = await prisma.user.findUnique({
      where: { email: username },
      include: { Traveler: true, Provider: true },
    });
    if (!existingUser) {
      existingUser = await prisma.user.findUnique({
        where: { username },
        include: { Traveler: true, Provider: true },
      });
    }
    if (!existingUser)
      throw new AppError(
        ERROR_CODES.WRONG_CREDENTIALS.statusCode,
        ERROR_CODES.WRONG_CREDENTIALS.message,
        ERROR_CODES.WRONG_CREDENTIALS.code,
      );

    if (existingUser.status === "LOCKED")
      throw new AppError(
        ERROR_CODES.ACCOUNT_LOCKED.statusCode,
        ERROR_CODES.ACCOUNT_LOCKED.message,
        ERROR_CODES.ACCOUNT_LOCKED.code,
      );

    const is_valid_password = await bcrypt.compare(password, existingUser.password);
    if (!is_valid_password)
      throw new AppError(
        ERROR_CODES.WRONG_CREDENTIALS.statusCode,
        ERROR_CODES.WRONG_CREDENTIALS.message,
        ERROR_CODES.WRONG_CREDENTIALS.code,
      );

    const accessExpires = remember ? "7d" : "1h";
    const refreshTtlSeconds = remember ? 60 * 60 * 24 * 60 : 60 * 60 * 24 * 30;

    const access_token = signAccessToken(
      { id: existingUser.id, email: existingUser.email },
      accessExpires,
    );
    const refresh_token = signRefreshToken(
      { id: existingUser.id, remember },
      `${Math.floor(refreshTtlSeconds / (60 * 60 * 24))}d`,
    );

    await storeRefreshToken(existingUser.id, refresh_token, refreshTtlSeconds);

    let role = "UNVERIFIED";
    if (existingUser.Traveler?.length > 0) role = "TRAVELER";
    else if (existingUser.Provider?.length > 0) role = "PROVIDER";
    else if (existingUser.is_admin) role = "ADMIN";

    return {
      access_token,
      refresh_token,
      expires_in: accessExpires,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        role,
        name: existingUser.name,
      },
    };
  },

  refreshToken: async ({ refresh_token }) => {
    if (!refresh_token)
      throw new AppError(
        ERROR_CODES.MISSING_FIELDS.statusCode,
        "Missing refresh_token",
        ERROR_CODES.MISSING_FIELDS.code,
      );
    let payload;
    try {
      payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    } catch (_err) {
      throw new AppError(
        ERROR_CODES.INVALID_REFRESH_TOKEN.statusCode,
        ERROR_CODES.INVALID_REFRESH_TOKEN.message,
        ERROR_CODES.INVALID_REFRESH_TOKEN.code,
      );
    }

    const userId = payload.id;
    const remember = payload.remember || false;
    const stored = await getStoredRefreshToken(userId);
    if (!stored || stored !== refresh_token) {
      throw new AppError(
        ERROR_CODES.REVOKED_REFRESH_TOKEN.statusCode,
        ERROR_CODES.REVOKED_REFRESH_TOKEN.message,
        ERROR_CODES.REVOKED_REFRESH_TOKEN.code,
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Traveler: true, Provider: true },
    });

    if (!user)
      throw new AppError(
        ERROR_CODES.WRONG_CREDENTIALS.statusCode,
        ERROR_CODES.WRONG_CREDENTIALS.message,
        ERROR_CODES.WRONG_CREDENTIALS.code,
      );

    if (user.status === "LOCKED") {
      throw new AppError(
        ERROR_CODES.ACCOUNT_LOCKED.statusCode,
        ERROR_CODES.ACCOUNT_LOCKED.message,
        ERROR_CODES.ACCOUNT_LOCKED.code,
      );
    }

    // issue new tokens (keep same remember policy by checking remaining TTL? simple approach: default durations)
    const access_token = signAccessToken({ id: userId }, "10d");
    const new_refresh_token = signRefreshToken({ id: userId, remember }, remember ? "60d" : "30d");

    const ttlSeconds = remember ? 60 * 60 * 24 * 60 : 60 * 60 * 24 * 30;
    await storeRefreshToken(userId, new_refresh_token, ttlSeconds);

    return { access_token, refresh_token: new_refresh_token };
  },

  signupWithSocialMedia: async (_req, _res, _next) => {},

  loginWithSocialMedia: async (_req, _res, _next) => {},

  logout: async ({ userId }) => {
    if (!userId)
      throw new AppError(
        ERROR_CODES.MISSING_FIELDS.statusCode,
        "Missing userId",
        ERROR_CODES.MISSING_FIELDS.code,
      );
    await revokeRefreshToken(userId);
    return { message: "Logged out" };
  },

  // helper for middleware
  verifyAccessToken: async (token) => {
    if (!token)
      throw new AppError(
        ERROR_CODES.MISSING_FIELDS.statusCode,
        "Missing access token",
        ERROR_CODES.MISSING_FIELDS.code,
      );
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          email: true,
          status: true,
          Traveler: true,
          Provider: true,
        },
      });

      if (!user)
        throw new AppError(
          ERROR_CODES.WRONG_CREDENTIALS.statusCode,
          ERROR_CODES.WRONG_CREDENTIALS.message,
          ERROR_CODES.WRONG_CREDENTIALS.code,
        );

      if (user.status === "LOCKED") {
        throw new AppError(
          ERROR_CODES.ACCOUNT_LOCKED.statusCode,
          ERROR_CODES.ACCOUNT_LOCKED.message,
          ERROR_CODES.ACCOUNT_LOCKED.code,
        );
      }

      let role = "UNVERIFIED";
      if (user.Traveler?.length > 0) role = "TRAVELER";
      if (user.Provider?.length > 0) role = "PROVIDER";
      if (user.is_admin) role = "ADMIN";

      return {
        id: user.id,
        email: user.email,
        role,
      };
    } catch (_err) {
      throw new AppError(
        ERROR_CODES.INVALID_ACCESS_TOKEN.statusCode,
        ERROR_CODES.INVALID_ACCESS_TOKEN.message,
        ERROR_CODES.INVALID_ACCESS_TOKEN.code,
      );
    }
  },
};

module.exports = { AuthService };
