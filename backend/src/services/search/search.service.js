const prisma = require("../../configs/prisma");
const { defaultModel } = require("../../configs/gemini");
const { searchEntity } = require("./searchRankAndFormat");
const { voicePrompt, imagePrompt } = require("../../utils/prompts");
const {
  SearchServiceDTO,
  SearchVoucherDTO,
  SearchRoomDTO,
  SearchMenuDTO,
  SearchTicketDTO,
  SearchPlaceDTO,
  SearchTourDTO,
  SearchProviderDTO,
} = require("../../dtos/search.dto");

const SearchService = {
  searchServices: (keyword, location, priceMin, priceMax, guests, filters) =>
    searchEntity({
      keyword,
      location,
      priceMin,
      priceMax,
      guests,
      filters,
      builderFn: (builder, intent) => {
        builder.addUniversalForService(intent.query || keyword);
        builder.applyFilters(intent, "service");
      },
      prismaFn: (where) =>
        prisma.service.findMany({
          where,
          include: {
            Type: true,
            Provider: { include: { user: { select: { name: true } } } },
            Tags: { include: { Tag: true } },
            Vouchers: { where: { valid_to: { gte: new Date() } } },
            Menus: { include: { MenuItems: true } },
            Tour: {
              include: {
                TourPlace: { include: { Place: true } },
                TourGuide: true,
              },
            },
            Rooms: {
              include: {
                facilities: { include: { facility: true } },
                images: { orderBy: { position: "asc" } },
              },
            },
            Tickets: { include: { Place: true } },
          },
        }),
      DTO: SearchServiceDTO,
    }),

  searchVouchers: (keyword, location, priceMin, priceMax, guests, filters) =>
    searchEntity({
      keyword,
      location,
      priceMin,
      priceMax,
      guests,
      filters,
      builderFn: (builder, intent) => {
        builder.addUniversalForVoucher(intent.query || keyword);
        builder.applyFilters(intent, "voucher");
      },
      prismaFn: (_where) =>
        prisma.voucher.findMany({
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
        }),
      DTO: SearchVoucherDTO,
    }),

  searchRooms: (keyword, location, priceMin, priceMax, guests, filters) =>
    searchEntity({
      keyword,
      location,
      priceMin,
      priceMax,
      guests,
      filters,
      builderFn: (builder, intent) => {
        builder.applyFilters(intent, "room");
        if (intent.pet_friendly === true) builder.where.AND.push({ pet_allowed: true });
      },
      prismaFn: (where) =>
        prisma.room.findMany({
          where,
          include: {
            service: {
              include: { Type: true, Tags: { include: { Tag: true } } },
            },
            facilities: { include: { facility: true } },
            images: { orderBy: { position: "asc" } },
          },
        }),
      DTO: SearchRoomDTO,
    }),

  searchMenus: (keyword, location, priceMin, priceMax, guests, filters) =>
    searchEntity({
      keyword,
      location,
      priceMin,
      priceMax,
      guests,
      filters,
      builderFn: (builder, intent) => {
        builder.addUniversalForMenu(intent.query || keyword);
        builder.applyFilters(intent, "menu");
      },
      prismaFn: (where) =>
        prisma.menu.findMany({
          where,
          include: {
            Service: {
              include: { Type: true, Tags: { include: { Tag: true } } },
            },
            MenuItems: true,
          },
        }),
      DTO: SearchMenuDTO,
    }),

  searchTickets: (keyword, location, priceMin, priceMax, guests, filters) =>
    searchEntity({
      keyword,
      location,
      priceMin,
      priceMax,
      guests,
      filters,
      builderFn: (builder, intent) => {
        builder.addUniversalForTicket(intent.query || keyword);
        builder.applyFilters(intent, "ticket");
      },
      prismaFn: (where) =>
        prisma.ticket.findMany({
          where,
          include: {
            Service: {
              include: { Type: true, Tags: { include: { Tag: true } } },
            },
            Place: true,
          },
        }),
      DTO: SearchTicketDTO,
    }),

  searchPlaces: (keyword, location, priceMin, priceMax, guests, filters) =>
    searchEntity({
      keyword,
      location,
      priceMin,
      priceMax,
      guests,
      filters,
      builderFn: (builder, intent) => {
        builder.addUniversalForPlace(intent.query || keyword);
        builder.applyFilters(intent, "place");
      },
      prismaFn: (where) =>
        prisma.place.findMany({
          where,
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
        }),
      DTO: SearchPlaceDTO,
    }),

  searchTours: (keyword, location, priceMin, priceMax, guests, filters) =>
    searchEntity({
      keyword,
      location,
      priceMin,
      priceMax,
      guests,
      filters,
      builderFn: (builder, intent) => {
        builder.addUniversalForTour(intent.query || keyword);
        builder.applyFilters(intent, "tour");
      },
      prismaFn: (where) =>
        prisma.tour.findMany({
          where,
          include: {
            Service: {
              include: { Type: true, Tags: { include: { Tag: true } } },
            },
            TourPlace: { include: { Place: true } },
            TourGuide: true,
          },
        }),
      DTO: SearchTourDTO,
    }),

  searchProviders: (keyword, location, priceMin, priceMax, guests, filters) =>
    searchEntity({
      keyword,
      location,
      priceMin,
      priceMax,
      guests,
      filters,
      builderFn: (builder, intent) => {
        builder.addUniversalForProvider(intent.query || keyword);
        builder.applyFilters(intent, "provider");
      },
      prismaFn: (where) =>
        prisma.provider.findMany({
          where,
          include: {
            user: { select: { name: true } },
            Services: {
              include: { Type: true, Tags: { include: { Tag: true } } },
            },
          },
        }),
      DTO: SearchProviderDTO,
    }),

  handleMediaSearch: async (mode, buffer, searchFn) => {
    const base64 = buffer.toString("base64");
    const mimeType = mode === "voice" ? "audio/webm" : "image/jpeg";
    const prompts = { voice: voicePrompt, image: imagePrompt };

    const result = await defaultModel.generateContent([
      prompts[mode],
      { inlineData: { mimeType, data: base64 } },
    ]);

    const text = result.response.text().trim();
    console.log("🎤 Media transcription:", text);

    return searchFn(text);
  },
};

module.exports = SearchService;
