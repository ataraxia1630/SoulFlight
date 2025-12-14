const { MenuService } = require("../services/menu.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const MenuController = {
  create: catchAsync(async (req, res) => {
    const coverFile = req.file;
    const menu = await MenuService.create(req.body, coverFile);
    res.status(201).json(success(menu));
  }),

  getAll: catchAsync(async (_req, res) => {
    const menus = await MenuService.getAll();
    res.json(success(menus));
  }),

  getById: catchAsync(async (req, res) => {
    const menu = await MenuService.getById(req.params.id);
    res.json(success(menu));
  }),

  update: catchAsync(async (req, res) => {
    const coverFile = req.file;
    const menu = await MenuService.update(req.params.id, req.body, coverFile);
    res.json(success(menu));
  }),

  delete: catchAsync(async (req, res) => {
    await MenuService.delete(req.params.id);
    res.json(success());
  }),

  getByService: catchAsync(async (req, res) => {
    const menus = await MenuService.getByService(req.params.serviceId);
    res.json(success(menus));
  }),

  getByProvider: catchAsync(async (req, res) => {
    const menus = await MenuService.getByProvider(req.params.providerId);
    res.json(success(menus));
  }),
};

module.exports = { MenuController };
