const { ServiceTypeService } = require('../services/serviceType.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');
const { ServiceTypeDTO } = require('../dtos/type.dto');

const ServiceTypeController = {
  getAll: catchAsync(async (req, res) => {
    const serviceTypes = await ServiceTypeService.getAll();
    res
      .status(200)
      .json(ApiResponse.success(ServiceTypeDTO.fromList(serviceTypes)));
  }),

  getById: catchAsync(async (req, res) => {
    const { id } = req.params;
    const type = await ServiceTypeService.getById(Number(id));
    res.status(200).json(ApiResponse.success(ServiceTypeDTO.fromModel(type)));
  }),

  create: catchAsync(async (req, res) => {
    const type = await ServiceTypeService.create(req.body);
    res.status(201).json(ApiResponse.success(ServiceTypeDTO.fromModel(type)));
  }),

  update: catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const type = await ServiceTypeService.update(Number(id), data);
    res.status(200).json(ApiResponse.success(ServiceTypeDTO.fromModel(type)));
  }),

  delete: catchAsync(async (req, res) => {
    const { id } = req.params;
    await ServiceTypeService.delete(Number(id));
    res.status(204).json(ApiResponse.success());
  }),
};

module.exports = { ServiceTypeController };
