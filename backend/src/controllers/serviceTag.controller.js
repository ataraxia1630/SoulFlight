const { get } = require('../routes/serviceTag.routes');
const { ServiceTagService } = require('../services/serviceTag.service');
const catchAsync = require('../utils/catchAsync');

const ServiceTagController = {
  getAll: catchAsync(async (req, res, next) => {
    const tags = await ServiceTagService.getAll();
    res.status(200).json({ status: 'success', tags });
  }),

  getById: catchAsync(async (req, res, next) => {
    const tag = await ServiceTagService.getById(req.params.id);
    res.status(200).json({ status: 'success', tag });
  }),

  create: catchAsync(async (req, res, next) => {
    const tag = await ServiceTagService.create(req.body);
    res.status(201).json({ status: 'success', tag });
  }),

  update: catchAsync(async (req, res, next) => {
    const tag = await ServiceTagService.update(req.params.id, req.body);
    res.status(200).json({ status: 'success', tag });
  }),

  delete: catchAsync(async (req, res, next) => {
    await ServiceTagService.delete(req.params.id);
    res.status(204).json({ status: 'success' });
  }),
};
module.exports = { ServiceTagController };
