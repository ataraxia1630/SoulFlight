const RoomService = require("../services/room.service");
const catchAsync = require("../utils/catchAsync");

const RoomController = {
  getAll: catchAsync(async (req, res, next) => {
    const rooms = await RoomService.getAll();
    res.status(200).json({ status: "success", rooms });
  }),

  getOne: catchAsync(async (req, res, next) => {
    const room = await RoomService.getOne(parseInt(req.params.id, 10));
    res.status(200).json({ status: "success", room });
  }),

  create: catchAsync(async (req, res, next) => {
    const room = await RoomService.create(req.body);
    res.status(201).json({ status: "success", room });
  }),

  update: catchAsync(async (req, res, next) => {
    const room = await RoomService.update(
      parseInt(req.params.id, 10),
      req.body
    );
    res.status(200).json({ status: "success", room });
  }),

  remove: catchAsync(async (req, res, next) => {
    await RoomService.remove(parseInt(req.params.id, 10));
    res.status(204).json({ status: "success" });
  }),
};

module.exports = RoomController;
