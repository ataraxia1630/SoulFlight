const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");
const { TourService } = require("../services/tour.service");
const { TourDTO } = require("../dtos/tour.dto");

const TourController = {
  getAll: catchAsync(async (req, res, _next) => {
    const tours = await TourService.getAll(req);
    res.status(200).json(ApiResponse.success(TourDTO.fromList(tours)));
  }),

  getById: catchAsync(async (req, res, _next) => {
    const tour = await TourService.getById(Number(req.params.id));
    res.status(200).json(ApiResponse.success(TourDTO.fromModel(tour)));
  }),

  getMine: catchAsync(async (req, res, _next) => {
    const tours = await TourService.getMine(req);
    res.status(200).json(ApiResponse.success(TourDTO.fromList(tours)));
  }),

  create: catchAsync(async (req, res, _next) => {
    const tour = await TourService.create(req.body);
    res.status(201).json(ApiResponse.success(TourDTO.fromModel(tour)));
  }),

  update: catchAsync(async (req, res, _next) => {
    const tour = await TourService.update(Number(req.params.id), req.body);
    res.status(200).json(ApiResponse.success(TourDTO.fromModel(tour)));
  }),

  delete: catchAsync(async (req, res, _next) => {
    await TourService.delete(Number(req.params.id));
    res.status(204).json(ApiResponse.success());
  }),
};

module.exports = { TourController };
