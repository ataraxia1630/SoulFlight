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
      const verify_token = await AuthService.verifyOtp(
        req.body.email,
        req.body.otp
      );
      return res.status(200).json({ message: 'OTP verified', verify_token });
    } catch (error) {
      next(error);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const user = await AuthService.createUser(req.body);
      return res.status(201).json({ message: 'User created', user });
    } catch (error) {
      next(error);
    }
  },

  createTraveler: async (req, res, next) => {
    try {
      const traveler = await AuthService.createTraveler(req.body);
      return res.status(201).json({ message: 'Traveler created', traveler });
    } catch (error) {
      next(error);
    }
  },

  createProvider: async (req, res, next) => {
    try {
      const provider = await AuthService.createProvider(req.body);
      return res.status(201).json({ message: 'Provider created', provider });
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
