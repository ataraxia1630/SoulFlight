const prisma = require("../configs/prisma");
const { defaultModel } = require("../configs/gemini");
const SearchQueryBuilder = require("../utils/SearchQueryBuilder");
const { applyFilters } = require("../utils/autoFilter");
const {
  SearchServiceDTO,
  SearchVoucherDTO,
  SearchRoomDTO,
  SearchMenuDTO,
  SearchTicketDTO,
  SearchPlaceDTO,
  SearchTourDTO,
  SearchProviderDTO,
} = require("../dtos/search.dto");

const SearchService = {
  // Text search cho từng loại
  searchServices: async (query, location, filters = {}) => {
    const builder = new SearchQueryBuilder();
    builder.addKeywordSearch(query);
    if (location) builder.addLocation(location);
    applyFilters(builder, filters);

    const services = await prisma.service.findMany({
      where: builder.build(),
      include: {
        Type: true,
        Provider: { include: { user: { select: { name: true } } } },
        Tags: { include: { Tag: true } },
        Vouchers: { where: { valid_to: { gte: new Date() } } },
        Menus: { include: { MenuItems: true } },
        Tour: {
          include: { TourPlace: { include: { Place: true } }, TourGuide: true },
        },
        Rooms: {
          include: {
            facilities: { include: { facility: true } },
            images: { orderBy: { position: "asc" } },
          },
        },
        Tickets: { include: { Place: true } },
      },
      orderBy: { rating: "desc" },
    });

    return SearchServiceDTO.fromList(services);
  },

  searchVouchers: async (query, location, filters = {}) => {
    const builder = new SearchQueryBuilder();
    builder.addKeywordInVoucher(query);
    if (location) builder.addLocation(location);
    applyFilters(builder, filters);

    const vouchers = await prisma.voucher.findMany({
      where: builder.buildForVoucher(),
      include: {
        service: {
          include: {
            Type: true,
            Provider: { include: { user: { select: { name: true } } } },
            Tags: { include: { Tag: true } },
          },
        },
      },
      orderBy: { discount_percent: "desc" },
    });

    return SearchVoucherDTO.fromList(vouchers);
  },

  searchRooms: async (query, location, filters = {}) => {
    const builder = new SearchQueryBuilder();
    builder.addKeywordInRoom(query);
    if (location) builder.addLocation(location);
    applyFilters(builder, filters);

    const rooms = await prisma.room.findMany({
      where: builder.buildForRoom(),
      include: {
        service: { include: { Type: true, Tags: { include: { Tag: true } } } },
        facilities: { include: { facility: true } },
        images: { orderBy: { position: "asc" } },
      },
      orderBy: { price_per_night: "asc" },
    });

    return SearchRoomDTO.fromList(rooms);
  },

  searchMenus: async (query, location, filters = {}) => {
    const builder = new SearchQueryBuilder();
    builder.addKeywordInMenu(query);
    if (location) builder.addLocation(location);
    applyFilters(builder, filters);

    const menus = await prisma.menu.findMany({
      where: builder.buildForMenu(),
      include: {
        Service: { include: { Type: true, Tags: { include: { Tag: true } } } },
        MenuItems: true,
      },
      orderBy: { created_at: "desc" },
    });

    return SearchMenuDTO.fromList(menus);
  },

  searchTickets: async (query, location, filters = {}) => {
    const builder = new SearchQueryBuilder();
    builder.addKeywordInTicket(query);
    if (location) builder.addLocation(location);
    applyFilters(builder, filters);

    const tickets = await prisma.ticket.findMany({
      where: builder.buildForTicket(),
      include: {
        Service: { include: { Type: true, Tags: { include: { Tag: true } } } },
        Place: true,
      },
      orderBy: { price: "asc" },
    });

    return SearchTicketDTO.fromList(tickets);
  },

  searchPlaces: async (query, location, filters = {}) => {
    const builder = new SearchQueryBuilder();
    builder.addKeywordInPlace(query);
    if (location) builder.addLocation(location);
    applyFilters(builder, filters);

    const places = await prisma.place.findMany({
      where: builder.buildForPlace(),
      include: {
        TourPlace: {
          include: {
            Tour: {
              include: {
                Service: { include: { Tags: { include: { Tag: true } } } },
              },
            },
          },
        },
        Tickets: {
          include: {
            Service: { include: { Tags: { include: { Tag: true } } } },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return SearchPlaceDTO.fromList(places);
  },

  searchTours: async (query, location, filters = {}) => {
    const builder = new SearchQueryBuilder();
    builder.addKeywordInTour(query);
    if (location) builder.addLocation(location);
    applyFilters(builder, filters);

    const tours = await prisma.tour.findMany({
      where: builder.buildForTour(),
      include: {
        Service: { include: { Type: true, Tags: { include: { Tag: true } } } },
        TourPlace: { include: { Place: true } },
        TourGuide: true,
      },
      orderBy: { total_price: "asc" },
    });

    return SearchTourDTO.fromList(tours);
  },

  searchProviders: async (query, location, filters = {}) => {
    const builder = new SearchQueryBuilder();
    builder.addKeywordInProvider(query);
    if (location) builder.addLocation(location);
    applyFilters(builder, filters);

    const providers = await prisma.provider.findMany({
      where: builder.buildForProvider(),
      include: {
        user: { select: { name: true } },
        Services: { include: { Type: true, Tags: { include: { Tag: true } } } },
      },
      orderBy: { created_at: "desc" },
    });

    return SearchProviderDTO.fromList(providers);
  },

  // Image & Voice
  handleMediaSearch: async (mode, buffer, searchFn) => {
    const base64 = buffer.toString("base64");
    const mimeType = mode === "voice" ? "audio/webm" : "image/jpeg";

    const prompts = {
      voice: `You are a travel search assistant. 
        Analyze this voice recording and return ONLY a JSON object with:
        {
          "searchQuery": "main keyword user wants to search",
          "location": "city or place mentioned",
          "filters": { "pet_friendly": true, "price": "0-1000000", ... }
        }
        Example: {"searchQuery": "spa", "location": "Đà Lạt", "filters": {}}`,

      image: `You are a travel search assistant.
        Analyze this image and return ONLY a JSON object with:
        {
          "searchQuery": "what user wants to find",
          "location": "where it is",
          "filters": { "type": "Hotel", "rating_min": "4.0", ... }
        }
        Example: {"searchQuery": "beach resort", "location": "Phú Quốc", "filters": {}}`,
    };

    const result = await defaultModel.generateContent([
      prompts[mode],
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
    ]);

    const text = result.response.text().trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let intent = { q: "travel", location: null, filters: {} };

    if (jsonMatch) {
      try {
        intent = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn("JSON parse failed:", e);
      }
    }

    if (!intent.q || intent.q === "travel") {
      intent.q = text.split(/ ở | tại | in /i)[0]?.trim() || "travel";
      intent.location = text.match(/ở\s+([^\s,]+)/i)?.[1] || text.match(/in\s+([^\s,]+)/i)?.[1];
    }

    return await searchFn(intent.q, intent.location, intent.filters);
  },
};

module.exports = SearchService;
