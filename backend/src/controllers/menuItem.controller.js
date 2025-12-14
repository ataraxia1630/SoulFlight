const { MenuItemService } = require("../services/menuItem.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const MenuItemController = {
  getAll: catchAsync(async (_req, res) => {
    const items = await MenuItemService.getAll();
    res.json(success(items));
  }),

  getById: catchAsync(async (req, res) => {
    const item = await MenuItemService.getById(req.params.id);
    res.json(success(item));
  }),

  getByMenu: catchAsync(async (req, res) => {
    const items = await MenuItemService.getByMenu(req.params.menuId);
    res.json(success(items));
  }),

  create: catchAsync(async (req, res) => {
    const imageFile = req.file;
    const item = await MenuItemService.create(req.body, imageFile);
    res.status(201).json(success(item));
  }),

  update: catchAsync(async (req, res) => {
    const imageFile = req.file;
    const item = await MenuItemService.update(req.params.id, req.body, imageFile);
    res.json(success(item));
  }),

  delete: catchAsync(async (req, res) => {
    await MenuItemService.delete(req.params.id);
    res.json(success());
  }),
};

module.exports = { MenuItemController };
