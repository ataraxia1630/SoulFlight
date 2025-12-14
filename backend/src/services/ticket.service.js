const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { TicketDTO } = require("../dtos/ticket.dto");
const { ERROR_CODES } = require("../constants/errorCode");
const { attachImagesList } = require("../utils/attachImage");

const commonInclude = {
  Service: { select: { id: true, name: true } },
  Place: true,
};

const attachPlaceImages = async (tickets) => {
  if (!tickets || tickets.length === 0) return tickets;

  const places = tickets.map((t) => t.Place).filter(Boolean);
  if (places.length === 0) return tickets;

  const placesWithImages = await attachImagesList({
    entities: places,
    type: "Place",
  });

  const placeMap = new Map(placesWithImages.map((p) => [p.id, p]));

  tickets.forEach((ticket) => {
    ticket.Place = placeMap.get(ticket.Place.id) || ticket.Place;
  });

  return tickets;
};

const TicketService = {
  getAll: async () => {
    const tickets = await prisma.ticket.findMany({
      include: commonInclude,
      orderBy: { updated_at: "desc" },
    });

    await attachPlaceImages(tickets);
    return TicketDTO.fromList(tickets);
  },

  getById: async (id) => {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(id, 10) },
      include: commonInclude,
    });

    if (!ticket) {
      throw new AppError(
        ERROR_CODES.TICKET_NOT_FOUND.statusCode,
        ERROR_CODES.TICKET_NOT_FOUND.message,
        ERROR_CODES.TICKET_NOT_FOUND.code,
      );
    }

    await attachPlaceImages([ticket]);
    return TicketDTO.fromModel(ticket);
  },

  getByService: async (serviceId) => {
    const tickets = await prisma.ticket.findMany({
      where: { service_id: parseInt(serviceId, 10) },
      include: commonInclude,
    });

    await attachPlaceImages(tickets);
    return TicketDTO.fromList(tickets);
  },

  getByProvider: async (providerId) => {
    const tickets = await prisma.ticket.findMany({
      where: {
        Service: { provider_id: parseInt(providerId, 10) },
      },
      include: commonInclude,
    });

    await attachPlaceImages(tickets);
    return TicketDTO.fromList(tickets);
  },

  create: async (data) => {
    const ticket = await prisma.ticket.create({
      data: {
        service_id: parseInt(data.service_id, 10),
        place_id: parseInt(data.place_id, 10),
        name: data.name,
        description: data.description || null,
        price: parseFloat(data.price),
        status: data.status || "AVAILABLE",
      },
      include: commonInclude,
    });

    return TicketService.getById(ticket.id);
  },

  update: async (id, data) => {
    const ticketId = parseInt(id, 10);

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new AppError(
        ERROR_CODES.TICKET_NOT_FOUND.statusCode,
        ERROR_CODES.TICKET_NOT_FOUND.message,
        ERROR_CODES.TICKET_NOT_FOUND.code,
      );
    }

    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        ...data,
        ...(data.price && { price: parseFloat(data.price) }),
        ...(data.place_id && { place_id: parseInt(data.place_id, 10) }),
        ...(data.service_id && { service_id: parseInt(data.service_id, 10) }),
      },
    });

    return TicketService.getById(ticketId);
  },

  delete: async (id) => {
    const ticketId = parseInt(id, 10);

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) {
      throw new AppError(
        ERROR_CODES.TICKET_NOT_FOUND.statusCode,
        ERROR_CODES.TICKET_NOT_FOUND.message,
        ERROR_CODES.TICKET_NOT_FOUND.code,
      );
    }

    await prisma.ticket.delete({
      where: { id: ticketId },
    });
  },

  checkAvailability: async (ticketId, visitDate, quantity = 1) => {
    const ticket = await TicketService.getById(ticketId);

    if (!visitDate) {
      throw new AppError(
        ERROR_CODES.MISSING_DATES.statusCode,
        ERROR_CODES.MISSING_DATES.message,
        ERROR_CODES.MISSING_DATES.code,
      );
    }

    const dateOnly = new Date(visitDate);

    const availability = await prisma.ticketAvailability.findUnique({
      where: {
        ticket_id_date: {
          ticket_id: parseInt(ticketId, 10),
          date: dateOnly,
        },
      },
    });

    if (!availability) {
      return {
        available: false,
        reason: "Ticket not available on this date",
      };
    }

    if (availability.max_count !== null && quantity > availability.max_count) {
      return {
        available: false,
        reason: "Exceed maximum ticket quantity",
      };
    }

    return {
      available: availability.available_count >= quantity,
      available_count: availability.available_count,
      required_quantity: quantity,
      ticket,
    };
  },

  getAvailable: async (serviceId, visitDate, quantity = 1) => {
    const tickets = await prisma.ticket.findMany({
      where: {
        service_id: parseInt(serviceId, 10),
        status: "AVAILABLE",
      },
      include: commonInclude,
    });

    const results = [];

    for (const ticket of tickets) {
      const check = await TicketService.checkAvailability(ticket.id, visitDate, quantity);

      if (check.available) {
        results.push({ ticket });
      }
    }

    await attachPlaceImages(results);
    return TicketDTO.fromList(results);
  },
};

module.exports = TicketService;
