const catchAsync = require("../utils/catchAsync");
const TravelerService = require("../services/traveler.service");
const { success } = require("../utils/ApiResponse");

const TravelerController = {
  getMyProfile: catchAsync(async (req, res, _next) => {
    const profile = await TravelerService.getMyProfile(req.user.id);
    return res.status(200).json(success(profile));
  }),

  updateProfile: catchAsync(async (req, res, _next) => {
    const profile = await TravelerService.updateProfile(req.user.id, req.body, req.file);
    return res.status(200).json(success(profile));
  }),

  getAll: catchAsync(async (_req, res, _next) => {
    const result = await TravelerService.getAll();
    return res.status(200).json(success(result));
  }),
};

module.exports = TravelerController;
