const { AuthService } = require('../services/auth.service');

const AuthController = {
  sendOtp: async (req, res, next) => {
    try {
      if (!req.body.email) throw Error('Missing email');
      await AuthService.sendOtp(req.body.email);
      return res.status(201).json({ message: 'OPT sent' });
    } catch (error) {
      next(error);
    }
  },

  resendOtp: async (req, res, next) => {
    try {
      await AuthService.resendOtp(req.body.email);
      return res.status(201).json({ message: 'OPT resent' });
    } catch (error) {
      next(error);
    }
  },

  verifyOtp: async (req, res, next) => {
    try {
      await AuthService.verifyOtp(req.body.email, req.body.otp);
      return res.status(200).json({ message: 'OTP verified' });
    } catch (error) {
      next(error);
    }
  },

  signup: async (req, res, next) => {
    try {
      await AuthService.signup(req.body);
      return res.status(201).json({ message: 'User created' });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      await AuthService.login(req.body);
      return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      next(error);
    }
  },

  signupWithSocialMedia: async (req, res, next) => {},

  loginWithSocialMedia: async (req, res, next) => {},

  logout: async (req, res, next) => {
    try {
      await AuthService.logout({ userId: req.user.id });
      return res.status(200).json({ message: 'Logged out' });
    } catch (error) {}
  },
};

module.exports = { AuthController };
