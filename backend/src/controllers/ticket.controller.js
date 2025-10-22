const TicketService = require("../services/ticket.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");

const TicketController = {
  create: catchAsync(async (req, res) => {
    const ticket = await TicketService.create(req.body);
    res.status(201).json(ApiResponse.success(ticket));
  }),

  getAll: catchAsync(async (_req, res) => {
    const tickets = await TicketService.getAll();
    res.status(200).json(ApiResponse.success(tickets));
  }),

  getOne: catchAsync(async (req, res) => {
    const ticket = await TicketService.getOne(req.params.id);
    res.status(200).json(ApiResponse.success(ticket));
  }),

  update: catchAsync(async (req, res) => {
    const ticket = await TicketService.update(req.params.id, req.body);
    res.status(200).json(ApiResponse.success(ticket));
  }),

  delete: catchAsync(async (req, res) => {
    await TicketService.delete(req.params.id);
    res.status(200).json(ApiResponse.success());
  }),
};

module.exports = TicketController;
