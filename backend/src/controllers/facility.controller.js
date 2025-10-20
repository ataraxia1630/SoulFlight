const FacilityService = require("../services/facility.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

const FacilityController = {
  create: catchAsync(async (req, res, _next) => {
    const facility = await FacilityService.create(req.body, req.file);
    return res.status(201).json(ApiResponse.success(facility));
  }),

  getAll: catchAsync(async (req, res, _next) => {
    const facilities = await FacilityService.getAll();
    return res.status(200).json(ApiResponse.success(facilities));
  }),

  getOne: catchAsync(async (req, res, _next) => {
    const facility = await FacilityService.getOne(req.params.id);
    return res.status(200).json(ApiResponse.success(facility));
  }),

  update: catchAsync(async (req, res, _next) => {
    const facility = await FacilityService.update(req.params.id, req.body, req.file);
    return res.status(200).json(ApiResponse.success(facility));
  }),

  remove: catchAsync(async (req, res, _next) => {
    await FacilityService.remove(req.params.id);
    return res.status(200).json(ApiResponse.success());
  }),
};

module.exports = FacilityController;
