const { MenuItemService } = require('../services/menuItem.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

const MenuItemController = {
  getAll: catchAsync(async (req, res, next) => {
    const items = await MenuItemService.getAll();
    res.status(200).json(ApiResponse.success(items));
  }),

  getById: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const item = await MenuItemService.getById(Number(id));
    res.status(200).json(ApiResponse.success(item));
  }),

  create: catchAsync(async (req, res, next) => {
    const data = req.body;
    const item = await MenuItemService.create(data);
    res.status(201).json(ApiResponse.success(item));
  }),

  update: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    const item = await MenuItemService.update(Number(id), data);
    res.status(200).json(ApiResponse.success(item));
  }),

  delete: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await MenuItemService.delete(Number(id));
    res.status(204).json(ApiResponse.success());
  }),
};

module.exports = { MenuItemController };
