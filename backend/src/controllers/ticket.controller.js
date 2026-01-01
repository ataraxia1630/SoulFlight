const { TicketService } = require("../services/ticket.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const TicketController = {
  getAll: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    res.json(success(await TicketService.getAll(travelerId)));
  }),

  getById: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    res.json(success(await TicketService.getById(req.params.id, travelerId)));
  }),

  getByService: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    res.json(success(await TicketService.getByService(req.params.serviceId, travelerId)));
  }),

  getByProvider: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    res.json(success(await TicketService.getByProvider(req.params.providerId, travelerId)));
  }),

  checkAvailability: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    const { visitDate, quantity = 1 } = req.query;
    const result = await TicketService.checkAvailability(
      req.params.ticketId,
      travelerId,
      visitDate,
      parseInt(quantity, 10),
    );
    res.json(success(result));
  }),

  getAvailable: catchAsync(async (req, res) => {
    const travelerId = req.user?.id || null;
    const { visitDate, quantity = 1 } = req.query;
    const result = await TicketService.getAvailable(
      req.params.serviceId,
      travelerId,
      visitDate,
      parseInt(quantity, 10),
    );
    res.json(success(result));
  }),

  create: catchAsync(async (req, res) => {
    res.json(success(await TicketService.create(req.body)));
  }),

  update: catchAsync(async (req, res) => {
    res.json(success(await TicketService.update(req.params.id, req.body)));
  }),

  delete: catchAsync(async (req, res) => {
    await TicketService.delete(req.params.id);
    res.json(success());
  }),
};

module.exports = TicketController;
