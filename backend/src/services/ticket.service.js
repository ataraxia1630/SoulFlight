const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { TicketDTO } = require("../dtos/ticket.dto");
const { ERROR_CODES } = require("../constants/errorCode");

const TicketService = {
  create: async (data) => {
    try {
      const ticket = await prisma.ticket.create({
        data,
        include: {
          Service: { select: { name: true } },
          Place: { select: { name: true, address: true } },
        },
      });
      return TicketDTO.fromModel(ticket);
    } catch {
      throw new AppError(
        ERROR_CODES.TICKET_CREATE_FAILED.statusCode,
        ERROR_CODES.TICKET_CREATE_FAILED.message,
        ERROR_CODES.TICKET_CREATE_FAILED.code,
      );
    }
  },

  getAll: async () => {
    const tickets = await prisma.ticket.findMany({
      include: {
        Service: { select: { name: true } },
        Place: { select: { name: true, address: true } },
      },
      orderBy: { created_at: "desc" },
    });
    return TicketDTO.fromList(tickets);
  },

  getOne: async (id) => {
    const parsedId = parseInt(id, 10);
    const ticket = await prisma.ticket.findUnique({
      where: { id: parsedId },
      include: {
        Service: { select: { name: true } },
        Place: { select: { name: true, address: true } },
      },
    });
    if (!ticket) {
      throw new AppError(
        ERROR_CODES.TICKET_NOT_FOUND.statusCode,
        ERROR_CODES.TICKET_NOT_FOUND.message,
        ERROR_CODES.TICKET_NOT_FOUND.code,
      );
    }
    return TicketDTO.fromModel(ticket);
  },

  update: async (id, data) => {
    const parsedId = parseInt(id, 10);

    const existing = await prisma.ticket.findUnique({
      where: { id: parsedId },
    });
    if (!existing) {
      throw new AppError(
        ERROR_CODES.TICKET_NOT_FOUND.statusCode,
        ERROR_CODES.TICKET_NOT_FOUND.message,
        ERROR_CODES.TICKET_NOT_FOUND.code,
      );
    }

    try {
      const updated = await prisma.ticket.update({
        where: { id: parsedId },
        data,
        include: {
          Service: { select: { name: true } },
          Place: { select: { name: true, address: true } },
        },
      });
      return TicketDTO.fromModel(updated);
    } catch {
      throw new AppError(
        ERROR_CODES.TICKET_UPDATE_FAILED.statusCode,
        ERROR_CODES.TICKET_UPDATE_FAILED.message,
        ERROR_CODES.TICKET_UPDATE_FAILED.code,
      );
    }
  },

  delete: async (id) => {
    const parsedId = parseInt(id, 10);

    const ticket = await prisma.ticket.findUnique({
      where: { id: parsedId },
    });
    if (!ticket) {
      throw new AppError(
        ERROR_CODES.TICKET_NOT_FOUND.statusCode,
        ERROR_CODES.TICKET_NOT_FOUND.message,
        ERROR_CODES.TICKET_NOT_FOUND.code,
      );
    }

    try {
      await prisma.ticket.delete({
        where: { id: parsedId },
      });
      return null;
    } catch {
      throw new AppError(
        ERROR_CODES.TICKET_DELETE_FAILED.statusCode,
        ERROR_CODES.TICKET_DELETE_FAILED.message,
        ERROR_CODES.TICKET_DELETE_FAILED.code,
      );
    }
  },
};

module.exports = TicketService;
