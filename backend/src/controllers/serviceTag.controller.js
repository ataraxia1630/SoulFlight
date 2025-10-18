const { ServiceTagService } = require('../services/serviceTag.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const { ServiceTagDTO } = require('../dtos/tag.dto');

const ServiceTagController = {
  getAll: catchAsync(async (req, res, next) => {
    const tags = await ServiceTagService.getAll();
    res.status(200).json(ApiResponse.success(ServiceTagDTO.fromList(tags)));
  }),

  getById: catchAsync(async (req, res, next) => {
    const tag = await ServiceTagService.getById(Number(req.params.id));
    res.status(200).json(ApiResponse.success(ServiceTagDTO.fromModel(tag)));
  }),

  create: catchAsync(async (req, res, next) => {
    const tag = await ServiceTagService.create(req.body);
    res.status(201).json(ApiResponse.success(ServiceTagDTO.fromModel(tag)));
  }),

  update: catchAsync(async (req, res, next) => {
    const tag = await ServiceTagService.update(Number(req.params.id), req.body);
    res.status(200).json(ApiResponse.success(ServiceTagDTO.fromModel(tag)));
  }),

  delete: catchAsync(async (req, res, next) => {
    await ServiceTagService.delete(Number(req.params.id));
    res.status(204).json(ApiResponse.success());
  }),
};
module.exports = { ServiceTagController };
