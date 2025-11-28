const catchAsync = require("../utils/catchAsync");
const ProviderService = require("../services/provider.service");
const { success } = require("../utils/ApiResponse");

const TravelerController = {
  getMyProfile: catchAsync(async (req, res, _next) => {
    const profile = await ProviderService.getMyProfile(req.user.id);
    return res.status(200).json(success(profile));
  }),

  updateProfile: catchAsync(async (req, res, _next) => {
    const profile = await ProviderService.updateProfile(req.user.id, req.body, req.file);
    return res.status(200).json(success(profile));
  }),

  adminUpdateProfile: catchAsync(async (req, res, _next) => {
    const providerId = parseInt(req.params.id, 10);
    const profile = await ProviderService.updateProfile(providerId, req.body, req.file);
    return res.status(200).json(success(profile));
  }),

  getAll: catchAsync(async (_req, res, _next) => {
    const result = await ProviderService.getAll();
    return res.status(200).json(success(result));
  }),
};

module.exports = TravelerController;
