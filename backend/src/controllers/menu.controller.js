const { MenuService } = require("../services/menu.service");
const catchAsync = require("../utils/catchAsync");

const MenuController = {
  getAll: catchAsync(async (_req, res, _next) => {
    const menus = await MenuService.getAll();
    res.status(200).json({ status: "success", menus });
  }),

  getById: catchAsync(async (req, res, _next) => {
    const menu = await MenuService.getById(parseInt(req.params.id, 10));
    res.status(200).json({ status: "success", menu });
  }),

  create: catchAsync(async (req, res, _next) => {
    const menu = await MenuService.create(req.body);
    res.status(201).json({ status: "success", menu });
  }),

  update: catchAsync(async (req, res, _next) => {
    const menu = await MenuService.update(parseInt(req.params.id, 10), req.body);
    res.status(200).json({ status: "success", menu });
  }),

  delete: catchAsync(async (req, res, _next) => {
    await MenuService.delete(parseInt(req.params.id, 10));
    res.status(204).json({ status: "success" });
  }),
};

module.exports = { MenuController };
