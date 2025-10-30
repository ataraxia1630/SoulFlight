const { ServiceTypeService } = require("../services/serviceType.service");
const catchAsync = require("../utils/catchAsync");

const ServiceTypeController = {
  getAll: catchAsync(async (_req, res) => {
    const serviceTypes = await ServiceTypeService.getAll();
    res.status(200).json({ serviceTypes });
  }),

  getById: catchAsync(async (req, res) => {
    const { id } = req.params;
    const serviceType = await ServiceTypeService.getById(id);
    res.status(200).json({ serviceType });
  }),

  create: catchAsync(async (req, res) => {
    const newServiceType = await ServiceTypeService.create(req.body);
    res.status(201).json({ newServiceType });
  }),

  update: catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const updatedServiceType = await ServiceTypeService.update(id, data);
    res.status(200).json({ updatedServiceType });
  }),

  delete: catchAsync(async (req, res) => {
    const { id } = req.params;
    await ServiceTypeService.delete(id);
    res.status(204).json();
  }),
};

module.exports = { ServiceTypeController };
