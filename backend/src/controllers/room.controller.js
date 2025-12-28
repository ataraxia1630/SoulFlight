const RoomService = require("../services/room.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const RoomController = {
  create: catchAsync(async (req, res) => {
    const room = await RoomService.create(req.body, req.files);
    return res.status(201).json(success(room));
  }),

  getAll: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    const rooms = await RoomService.getAll(travelerId);
    return res.json(success(rooms));
  }),

  getOne: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    const room = await RoomService.getOne(req.params.id, travelerId);
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
    const travelerId = req.user?.id || null;

    const room = await RoomService.checkAvailability(
      roomId,
      travelerId,
      checkIn,
      checkOut,
      parseInt(quantity, 10),
    );

    return res.json(success(room));
  }),

  getAvailable: catchAsync(async (req, res) => {
    const { serviceId } = req.params;
    const { checkIn, checkOut, adults, children } = req.query;
    const travelerId = req.user?.id || null;

    const rooms = await RoomService.getAvailable(
      serviceId,
      travelerId,
      checkIn,
      checkOut,
      adults ? parseInt(adults, 10) : 1,
      children ? parseInt(children, 10) : 0,
    );

    return res.json(success(rooms));
  }),

  getByService: catchAsync(async (req, res) => {
    const { serviceId } = req.params;
    const travelerId = req.user?.id || null;
    const rooms = await RoomService.getByService(serviceId, travelerId);
    return res.json(success(rooms));
  }),

  getByProvider: catchAsync(async (req, res) => {
    const { providerId } = req.params;
    const travelerId = req.user?.id || null;
    const rooms = await RoomService.getByProvider(providerId, travelerId);
    return res.json(success(rooms));
  }),
};

module.exports = RoomController;
