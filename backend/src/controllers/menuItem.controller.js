const { MenuItemService } = require("../services/menuItem.service");
const catchAsync = require("../utils/catchAsync");

const MenuItemController = {
  getAll: catchAsync(async (_req, res, _next) => {
    const items = await MenuItemService.getAll();
    res.status(200).json({ status: "success", items });
  }),

  getById: catchAsync(async (req, res, _next) => {
    const { id } = req.params;
    const item = await MenuItemService.getById(Number(id));
    res.status(200).json({ status: "success", item });
  }),

  create: catchAsync(async (req, res, _next) => {
    const data = req.body;
    const item = await MenuItemService.create(data);
    res.status(201).json({ status: "success", item });
  }),

  update: catchAsync(async (req, res, _next) => {
    const { id } = req.params;
    const data = req.body;
    const item = await MenuItemService.update(Number(id), data);
    res.status(200).json({ status: "success", data: item });
  }),

  delete: catchAsync(async (req, res, _next) => {
    const { id } = req.params;
    await MenuItemService.delete(Number(id));
    res.status(204).json({ status: "success" });
  }),
};

module.exports = { MenuItemController };
