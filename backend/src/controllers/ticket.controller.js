const TicketService = require("../services/ticket.service");
const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/ApiResponse");

const TicketController = {
  getAll: catchAsync(async (_req, res) => {
    res.json(success(await TicketService.getAll()));
  }),

  getById: catchAsync(async (req, res) => {
    res.json(success(await TicketService.getById(req.params.id)));
  }),

  getByService: catchAsync(async (req, res) => {
    res.json(success(await TicketService.getByService(req.params.serviceId)));
  }),

  getByProvider: catchAsync(async (req, res) => {
    res.json(success(await TicketService.getByProvider(req.params.providerId)));
  }),

  checkAvailability: catchAsync(async (req, res) => {
    const { visitDate, quantity = 1 } = req.query;
    const result = await TicketService.checkAvailability(
      req.params.ticketId,
      visitDate,
      parseInt(quantity, 10),
    );
    res.json(success(result));
  }),

  getAvailable: catchAsync(async (req, res) => {
    const { visitDate, quantity = 1 } = req.query;
    const result = await TicketService.getAvailable(
      req.params.serviceId,
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
