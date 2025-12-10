const RoomService = require("../services/room.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const RoomController = {
  create: catchAsync(async (req, res) => {
    const room = await RoomService.create(req.body, req.files);
    return res.status(201).json(success(room));
  }),

  getAll: catchAsync(async (_req, res) => {
    const rooms = await RoomService.getAll();
    return res.json(success(rooms));
  }),

  getOne: catchAsync(async (req, res) => {
    const room = await RoomService.getOne(req.params.id);
    return res.json(success(room));
  }),

  update: catchAsync(async (req, res) => {
    let imageUpdates = [];

    if (req.body.imageActions != null) {
      try {
        if (typeof req.body.imageActions === "string") {
          imageUpdates = JSON.parse(req.body.imageActions);
        } else if (Array.isArray(req.body.imageActions)) {
          imageUpdates = req.body.imageActions;
        }

        if (!Array.isArray(imageUpdates)) {
          imageUpdates = [];
        }
      } catch {
        imageUpdates = [];
      }
    }

    const room = await RoomService.update(req.params.id, req.body, req.files || [], imageUpdates);

    return res.json(success(room));
  }),

  delete: catchAsync(async (req, res) => {
    await RoomService.delete(req.params.id);
    return res.json(success());
  }),

  checkAvailability: catchAsync(async (req, res) => {
    const { roomId } = req.params;
    const { checkIn, checkOut, quantity = 1 } = req.query;

    const room = await RoomService.checkAvailability(
      roomId,
      checkIn,
      checkOut,
      parseInt(quantity, 10),
    );

    return res.json(success(room));
  }),

  getAvailable: catchAsync(async (req, res) => {
    const { serviceId } = req.params;
    const { checkin, checkout, adults, children } = req.query;

    const rooms = await RoomService.getAvailableRooms(
      serviceId,
      checkin,
      checkout,
      adults ? parseInt(adults, 10) : 1,
      children ? parseInt(children, 10) : 0,
    );

    return res.json(success(rooms));
  }),
};

module.exports = RoomController;
