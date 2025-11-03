const { MenuService } = require("../services/menu.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

const MenuController = {
  getAll: catchAsync(async (_req, res, _next) => {
    const menus = await MenuService.getAll();
    res.status(200).json(ApiResponse.success(menus));
  }),

  getById: catchAsync(async (req, res, _next) => {
    const menu = await MenuService.getById(Number(req.params.id));
    res.status(200).json(ApiResponse.success(menu));
  }),

  create: catchAsync(async (req, res, _next) => {
    const menu = await MenuService.create(req.body);
    res.status(201).json(ApiResponse.success(menu));
  }),

  update: catchAsync(async (req, res, _next) => {
    const menu = await MenuService.update(Number(req.params.id), req.body);
    res.status(200).json(ApiResponse.success(menu));
  }),

  delete: catchAsync(async (req, res, _next) => {
    await MenuService.delete(Number(req.params.id));
    res.status(204).json(ApiResponse.success());
  }),
};

module.exports = { MenuController };
