const catchAsync = require("../utils/catchAsync");
const { AuthService } = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");
const { UserDTO } = require("../dtos/user.dto");

const AuthController = {
  sendOtp: catchAsync(async (req, res, _next) => {
    await AuthService.sendOtp(req.body.email);
    res.status(200).json(ApiResponse.success());
  }),

  resendOtp: catchAsync(async (req, res, _next) => {
    await AuthService.resendOtp(req.body.email);
    res.status(200).json(ApiResponse.success());
  }),

  verifyOtp: catchAsync(async (req, res, _next) => {
    const verify_token = await AuthService.verifyOtp(req.body.email, req.body.otp);
    return res.status(200).json(ApiResponse.success({ verify_token }));
  }),

  createUser: catchAsync(async (req, res, _next) => {
    const user = await AuthService.createUser(req.body);
    return res.status(201).json(ApiResponse.success(UserDTO.fromModel(user)));
  }),

  createTraveler: catchAsync(async (req, res, _next) => {
    const traveler = await AuthService.createTraveler(req.body);
    return res.status(201).json(ApiResponse.success({ traveler }));
  }),

  createProvider: catchAsync(async (req, res, _next) => {
    const provider = await AuthService.createProvider(req.body);
    return res.status(201).json(ApiResponse.success({ provider }));
  }),

  login: catchAsync(async (req, res, _next) => {
    const { access_token, refresh_token } = await AuthService.login(
      req.body.username,
      req.body.password,
      req.body.rememberMe,
    );
    return res.status(200).json(ApiResponse.success({ access_token, refresh_token }));
  }),

  signupWithSocialMedia: catchAsync(async (req, res, _next) => {
    const { access_token, refresh_token } = await AuthService.signupWithSocialMedia(
      req.body.email,
      req.body.username,
      req.body.provider,
    );
    return res.status(200).json(ApiResponse.success({ access_token, refresh_token }));
  }),

  loginWithSocialMedia: catchAsync(async (req, res, _next) => {
    const { access_token, refresh_token } = await AuthService.loginWithSocialMedia(
      req.body.email,
      req.body.provider,
    );
    return res.status(200).json(ApiResponse.success({ access_token, refresh_token }));
  }),

  logout: catchAsync(async (req, res, _next) => {
    await AuthService.logout(req.user.id);
    return res.status(200).json(ApiResponse.success());
  }),
};

module.exports = { AuthController };
