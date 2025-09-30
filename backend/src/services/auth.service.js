const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const redis = require('../configs/redis');
const prisma = require('../configs/prisma');

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
const signAccessToken = (payload, expires = '10d') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expires });

const signRefreshToken = (payload, expires = '30d') =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: expires });

// store single refresh token per user-device (simple). For multi-device, store as set.
const storeRefreshToken = async (userId, token, ttlSeconds) => {
  await redis.set(`refresh:${userId}`, token, 'EX', ttlSeconds);
};

const revokeRefreshToken = async (userId) => {
  await redis.del(`refresh:${userId}`);
};

const getStoredRefreshToken = async (userId) => {
  return await redis.get(`refresh:${userId}`);
};

const AuthService = {
  _generateOtp: () => {
    const min = Math.pow(10, OTP_DIGITS - 1);
    const max = Math.pow(10, OTP_DIGITS) - 1;
    return String(Math.floor(min + Math.random() * (max - min + 1)));
  },

  sendOtp: async (email) => {
    let existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('Email already registered');

    const otp = AuthService._generateOtp();
    const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);
    await redis.set(`otp:${email}`, hashedOtp, 'EX', 60 * OTP_EXPIRE_MIN);
    await redis.del(`otp_resend:${email}`);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Mã OTP Đăng Ký SoulFlight',
      html: `<p>Xin chào!</p><p>Mã OTP: <strong>${otp}</strong></p><p>Hết hạn sau 5 phút.</p><p>Trân trọng,<br>SoulFlight</p>`,
    };
    await transporter.sendMail(mailOptions);

    return { message: 'OTP sent' };
  },

  resendOtp: async (email) => {
    const key = `otp_resend:${email}`;
    const current = await redis.get(key);
    if (current && Number(current) >= OTP_RESEND_LIMIT) {
      throw new Error(
        `Resend OTP limit reached (${OTP_RESEND_LIMIT} times). Try after ${OTP_RESEND_WINDOW_MIN} minutes.`
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
    if (!hashedOtp) throw new Error('OTP expired or not found');
    const isValid = await bcrypt.compare(otp, hashedOtp);
    if (!isValid) throw new Error('Invalid OTP');
    await redis.del(`otp:${email}`);
    const verify_token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });
    return { verify_token };
  },

  createUser: async (data) => {
    const { email, username, password, role } = data;
    let existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('Email already registered');
    existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) throw new Error('Username already registered');

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email,
        name: username,
        username,
        password: password_hash,
        status: role === 'TRAVELER' ? 'ACTIVE' : 'UNVERIFIED',
      },
    });
    return user;
  },

  createTraveler: async (data) => {
    const { email, phone, ...travelerData } = data;
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        Traveler: true,
      },
    });
    if (!user) throw new Error('User not found');
    if (phone) {
      const existingUser = await prisma.user.findUnique({ where: { phone } });
      if (existingUser) throw new Error('Phone already registered');
      await prisma.user.update({
        where: { email },
        data: { phone },
      });
    }

    await prisma.traveler.create({
      data: {
        id: user.id,
        ...travelerData,
      },
    });
    return user;
  },

  createProvider: async (data) => {
    const { email, phone, ...providerData } = data;
    const user = await prisma.user.findUnique({
      where: { email },
      include: { Provider: true },
    });
    if (!user) throw new Error('User not found');
    if (phone) {
      const existingUser = await prisma.user.findUnique({ where: { phone } });
      if (existingUser) throw new Error('Phone already registered');
      await prisma.user.update({
        where: { id: user.id },
        data: { phone },
      });
    }

    await prisma.provider.create({
      data: {
        id: user.id,
        ...providerData,
      },
    });
    return user;
  },

  login: async ({ username, password, remember = false }) => {
    let existingUser = await prisma.user.findUnique({
      where: { email: username },
    });
    if (!existingUser) {
      existingUser = await prisma.user.findUnique({
        where: { username },
      });
    }
    if (!existingUser) throw new Error('Wrong email / username');

    if (existingUser.status === 'LOCKED') throw new Error('Account locked');

    const is_valid_password = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!is_valid_password) throw new Error('Wrong password');

    const accessExpires = remember ? '30d' : '10d';
    const refreshTtlSeconds = remember ? 60 * 60 * 24 * 60 : 60 * 60 * 24 * 30;

    const access_token = signAccessToken(
      { id: existingUser.id, email: existingUser.email },
      accessExpires
    );
    const refresh_token = signRefreshToken(
      { id: existingUser.id },
      `${Math.floor(refreshTtlSeconds / (60 * 60 * 24))}d`
    );

    await storeRefreshToken(existingUser.id, refresh_token, refreshTtlSeconds);

    return {
      access_token,
      refresh_token,
      expires_in: accessExpires,
    };
  },

  refreshToken: async ({ refresh_token }) => {
    if (!refresh_token) throw new Error('Missing refresh token');
    let payload;
    try {
      payload = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }

    const userId = payload.id;
    const stored = await getStoredRefreshToken(userId);
    if (!stored || stored !== refresh_token) {
      throw new Error('Refresh token revoked');
    }

    // issue new tokens (keep same remember policy by checking remaining TTL? simple approach: default durations)
    const access_token = signAccessToken({ id: userId }, '10d');
    const new_refresh_token = signRefreshToken({ id: userId }, '30d');

    // replace stored refresh token
    await storeRefreshToken(userId, new_refresh_token, 60 * 60 * 24 * 30);

    return { access_token, refresh_token: new_refresh_token };
  },

  signupWithSocialMedia: async (req, res, next) => {},

  loginWithSocialMedia: async (req, res, next) => {},

  logout: async ({ userId }) => {
    if (!userId) throw new Error('Missing user id');
    await revokeRefreshToken(userId);
    return { message: 'Logged out' };
  },

  // helper for middleware
  verifyAccessToken: async (token) => {
    if (!token) throw new Error('Missing token');
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      return payload;
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  },
};

module.exports = { AuthService };
