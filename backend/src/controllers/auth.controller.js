const catchAsync = require('../utils/catchAsync');
const { AuthService } = require('../services/auth.service');

const AuthController = {
  sendOtp: catchAsync(async (req, res, next) => {
    await AuthService.sendOtp(req.body.email);
    res.status(200).json({
      status: 'success',
      message: 'OTP sent',
    });
  }),

  resendOtp: catchAsync(async (req, res, next) => {
    await AuthService.resendOtp(req.body.email);
    res.status(200).json({
      status: 'success',
      message: 'OTP resent',
    });
  }),

  verifyOtp: catchAsync(async (req, res, next) => {
    const verify_token = await AuthService.verifyOtp(
      req.body.email,
      req.body.otp
    );
    return res.status(200).json({ message: 'OTP verified', verify_token });
  }),

  createUser: catchAsync(async (req, res, next) => {
    const user = await AuthService.createUser(req.body);
    return res.status(201).json({ message: 'User created', user });
  }),

  createTraveler: catchAsync(async (req, res, next) => {
    const traveler = await AuthService.createTraveler(req.body);
    return res.status(201).json({ message: 'Traveler created', traveler });
  }),

  createProvider: catchAsync(async (req, res, next) => {
    const provider = await AuthService.createProvider(req.body);
    return res.status(201).json({ message: 'Provider created', provider });
  }),

  login: catchAsync(async (req, res, next) => {
    const { access_token, refresh_token } = await AuthService.login(
      req.body.username,
      req.body.password
    );
    return res
      .status(200)
      .json({ message: 'Login successful', access_token, refresh_token });
  }),

  signupWithSocialMedia: catchAsync(async (req, res, next) => {
    const { access_token, refresh_token } =
      await AuthService.signupWithSocialMedia(
        req.body.email,
        req.body.username,
        req.body.provider
      );
    return res
      .status(200)
      .json({ message: 'Signup successful', access_token, refresh_token });
  }),

  loginWithSocialMedia: catchAsync(async (req, res, next) => {
    const { access_token, refresh_token } =
      await AuthService.loginWithSocialMedia(req.body.email, req.body.provider);
    return res
      .status(200)
      .json({ message: 'Login successful', access_token, refresh_token });
  }),

  logout: catchAsync(async (req, res, next) => {
    await AuthService.logout(req.user.id);
    return res.status(200).json({ message: 'Logout successful' });
  }),
};

module.exports = { AuthController };
