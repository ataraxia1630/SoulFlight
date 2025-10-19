const FacilityService = require("../services/facility.service");
const catchAsync = require("../utils/catchAsync");

const FacilityController = {
  getAll: catchAsync(async (_req, res, _next) => {
    const facilities = await FacilityService.getAll();
    res.status(200).json({ status: "success", facilities });
  }),

  getOne: catchAsync(async (req, res, _next) => {
    const facility = await FacilityService.getOne(parseInt(req.params.id, 10));
    res.status(200).json({ status: "success", facility });
  }),

  create: catchAsync(async (req, res, _next) => {
    const facility = await FacilityService.create(req.body);
    res.status(201).json({ status: "success", facility });
  }),

  update: catchAsync(async (req, res, _next) => {
    const facility = await FacilityService.update(parseInt(req.params.id, 10), req.body);
    res.status(200).json({ status: "success", facility });
  }),

  remove: catchAsync(async (req, res, _next) => {
    await FacilityService.remove(parseInt(req.params.id, 10));
    res.status(204).json({ status: "success" });
  }),
};

module.exports = FacilityController;
