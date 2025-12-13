const { PlaceService } = require("../services/place.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const PlaceController = {
  create: catchAsync(async (req, res) => {
    const place = await PlaceService.create(req.body, req.files || []);
    res.status(201).json(success(place));
  }),

  getAll: catchAsync(async (_req, res) => {
    const places = await PlaceService.getAll();
    res.json(success(places));
  }),

  getById: catchAsync(async (req, res) => {
    const place = await PlaceService.getById(req.params.id);
    res.json(success(place));
  }),

  update: catchAsync(async (req, res) => {
    const imageUpdates = req.body.imageActions ? JSON.parse(req.body.imageActions) : [];
    const place = await PlaceService.update(req.params.id, req.body, req.files || [], imageUpdates);
    res.json(success(place));
  }),

  delete: catchAsync(async (req, res) => {
    await PlaceService.delete(req.params.id);
    res.json(success());
  }),
};

module.exports = { PlaceController };
