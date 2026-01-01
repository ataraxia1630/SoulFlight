const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { TicketDTO } = require("../dtos/ticket.dto");
const { ERROR_CODES } = require("../constants/errorCode");
const { attachImagesList } = require("../utils/attachImage");
const { generateTicketAvailable } = require("../utils/generateTicketAvailable");
const cron = require("node-cron");

const commonInclude = (travelerId) => ({
  Service: {
    include: {
      Provider: {
        include: { user: true },
      },
      Wishlists: travelerId
        ? {
            where: { traveler_id: parseInt(travelerId, 10) },
          }
        : false,
    },
  },
  Place: true,
});

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
  getAll: async (travelerId) => {
    const tickets = await prisma.ticket.findMany({
      include: commonInclude(travelerId),
      orderBy: { updated_at: "desc" },
    });

    await attachPlaceImages(tickets);
    return TicketDTO.fromList(tickets);
  },

  getById: async (id, travelerId) => {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(id, 10) },
      include: commonInclude(travelerId),
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

  getByService: async (serviceId, travelerId) => {
    const tickets = await prisma.ticket.findMany({
      where: { service_id: parseInt(serviceId, 10) },
      include: commonInclude(travelerId),
      orderBy: { updated_at: "desc" },
    });

    await attachPlaceImages(tickets);
    return TicketDTO.fromList(tickets);
  },

  getByProvider: async (providerId, travelerId) => {
    const tickets = await prisma.ticket.findMany({
      where: {
        Service: { provider_id: parseInt(providerId, 10) },
      },
      include: commonInclude(travelerId),
    });

    tickets.sort((a, b) => {
      const isAvailableA = a.status === "AVAILABLE";
      const isAvailableB = b.status === "AVAILABLE";

      if (isAvailableA !== isAvailableB) {
        return Number(isAvailableB) - Number(isAvailableA);
      }
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

    await attachPlaceImages(tickets);
    return TicketDTO.fromList(tickets);
  },

  create: async (data) => {
    const { max_count, ...ticketData } = data;

    const ticket = await prisma.$transaction(async (tx) => {
      const createdTicket = await tx.ticket.create({
        data: {
          service_id: parseInt(ticketData.service_id, 10),
          place_id: parseInt(ticketData.place_id, 10),
          name: ticketData.name,
          description: ticketData.description || null,
          price: parseFloat(ticketData.price),
          status: ticketData.status || "AVAILABLE",
        },
        include: commonInclude(null),
      });

      await generateTicketAvailable(createdTicket.id, max_count, createdTicket.price, tx);

      return createdTicket;
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

  checkAvailability: async (ticketId, travelerId, visitDate, quantity = 1) => {
    const ticket = await TicketService.getById(ticketId, travelerId);

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
        reason: "Vé không có vào ngày này",
      };
    }

    if (availability.max_count !== null && quantity > availability.max_count) {
      return {
        available: false,
        reason: "Không đủ vé",
      };
    }

    return {
      available: availability.available_count >= quantity,
      available_count: availability.available_count,
      required_quantity: quantity,
      ticket,
    };
  },

  getAvailable: async (serviceId, travelerId, visitDate, quantity = 1) => {
    const tickets = await prisma.ticket.findMany({
      where: {
        service_id: parseInt(serviceId, 10),
        status: "AVAILABLE",
      },
      include: commonInclude(travelerId),
    });

    const results = [];

    for (const ticket of tickets) {
      const check = await TicketService.checkAvailability(
        ticket.id,
        travelerId,
        visitDate,
        quantity,
      );

      if (check.available) {
        results.push({ ticket });
      }
    }

    await attachPlaceImages(results);
    return TicketDTO.fromList(results);
  },
};

const startTicketExtensionCron = () => {
  // chạy mỗi ngày lúc 0h00
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("[TicketCron] Checking for tickets needing extension...");

      const tickets = await prisma.ticket.findMany({
        where: { status: "AVAILABLE" },
        select: { id: true, price: true },
      });

      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + 30);

      let extendedCount = 0;

      for (const ticket of tickets) {
        const lastAvail = await prisma.ticketAvailability.findFirst({
          where: { ticket_id: ticket.id },
          orderBy: { date: "desc" },
          select: { date: true, max_count: true },
        });

        // chọn ngày bắt đầu tạo bảng availability
        if (!lastAvail || lastAvail.date < thresholdDate) {
          let startDate = new Date();
          startDate.setHours(0, 0, 0, 0);

          if (lastAvail) {
            const nextDayAfterOldLimit = new Date(lastAvail.date);
            nextDayAfterOldLimit.setDate(nextDayAfterOldLimit.getDate() + 1);
            nextDayAfterOldLimit.setHours(0, 0, 0, 0);

            if (nextDayAfterOldLimit > startDate) {
              startDate = nextDayAfterOldLimit;
            }
          }

          await prisma.$transaction(async (tx) => {
            await generateTicketAvailable(
              ticket.id,
              lastAvail ? lastAvail.max_count : null,
              ticket.price,
              tx,
              startDate,
            );
          });

          extendedCount++;
        }
      }

      if (extendedCount > 0) {
        console.log(`[TicketCron] Extended availability for ${extendedCount} tickets.`);
      } else {
        console.log("[TicketCron] No tickets need extension.");
      }
    } catch (error) {
      console.error("[TicketCron] Error extending tickets:", error);
    }
  });
};

module.exports = { TicketService, startTicketExtensionCron };
