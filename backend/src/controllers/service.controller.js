const { ServiceService } = require("../services/service.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

const ServiceController = {
  getAll: catchAsync(async (_req, res, _next) => {
    const services = await ServiceService.getAll();
    res.status(200).json(ApiResponse.success(services));
  }),

  getById: catchAsync(async (req, res, _next) => {
    const { id } = req.params;
    const service = await ServiceService.getById(Number(id));
    res.status(200).json(ApiResponse.success(service));
  }),

  getByProvider: catchAsync(async (req, res, _next) => {
    const { providerId } = req.params;
    const service = await ServiceService.getByProvider(Number(providerId));
    res.status(200).json(ApiResponse.success(service));
  }),

  create: catchAsync(async (req, res, _next) => {
    const serviceData = req.body;
    const newService = await ServiceService.create(serviceData);
    res.status(201).json(ApiResponse.success(newService));
  }),

  update: catchAsync(async (req, res, _next) => {
    const { id } = req.params;
    const serviceData = req.body;
    const updatedService = await ServiceService.update(Number(id), serviceData);
    res.status(200).json(ApiResponse.success(updatedService));
  }),

  delete: catchAsync(async (req, res, _next) => {
    const { id } = req.params;
    await ServiceService.delete(Number(id));
    res.status(200).json(ApiResponse.success());
  }),
};

module.exports = { ServiceController };
