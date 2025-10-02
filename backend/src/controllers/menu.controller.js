const { MenuService } = require('../services/menu.service');
const catchAsync = require('../utils/catchAsync');

const MenuController = {
  getAll: catchAsync(async (req, res, next) => {
    const menus = await MenuService.getAll();
    res.status(200).json({ status: 'success', menus });
  }),

  getById: catchAsync(async (req, res, next) => {
    const menu = await MenuService.getById(parseInt(req.params.id));
    res.status(200).json({ status: 'success', menu });
  }),

  create: catchAsync(async (req, res, next) => {
    const menu = await MenuService.create(req.body);
    res.status(201).json({ status: 'success', menu });
  }),

  update: catchAsync(async (req, res, next) => {
    const menu = await MenuService.update(parseInt(req.params.id), req.body);
    res.status(200).json({ status: 'success', menu });
  }),

  delete: catchAsync(async (req, res, next) => {
    await MenuService.delete(parseInt(req.params.id));
    res.status(204).json({ status: 'success' });
  }),
};

module.exports = { MenuController };
