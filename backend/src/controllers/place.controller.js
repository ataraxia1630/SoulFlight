const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const { PlaceService } = require('../services/place.service');
const { PlaceDTO } = require('../dtos/place.dto');

const PlaceController = {
  getAll: catchAsync(async (req, res, next) => {
    const places = await PlaceService.getAll(req);
    res.status(200).json(ApiResponse.success(PlaceDTO.fromList(places)));
  }),

  getById: catchAsync(async (req, res, next) => {
    const place = await PlaceService.getById(Number(req.params.id));
    res.status(200).json(ApiResponse.success(PlaceDTO.fromModel(place)));
  }),

  create: catchAsync(async (req, res, next) => {
    const place = await PlaceService.create(req.body);
    res.status(201).json(ApiResponse.success(PlaceDTO.fromModel(place)));
  }),

  update: catchAsync(async (req, res, next) => {
    const place = await PlaceService.update(Number(req.params.id), req.body);
    res.status(200).json(ApiResponse.success(PlaceDTO.fromModel(place)));
  }),

  delete: catchAsync(async (req, res, next) => {
    await PlaceService.delete(Number(req.params.id));
    res.status(204).json(ApiResponse.success());
  }),
};

module.exports = { PlaceController };
