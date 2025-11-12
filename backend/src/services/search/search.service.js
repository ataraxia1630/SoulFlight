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
        builder.addQueryIfNoOtherFilters(intent, keyword, "service");
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
        builder.addQueryIfNoOtherFilters(intent, keyword, "voucher");
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
        builder.addQueryIfNoOtherFilters(intent, keyword, "room");
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
        builder.addQueryIfNoOtherFilters(intent, keyword, "menu");
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
        builder.addQueryIfNoOtherFilters(intent, keyword, "ticket");
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
        builder.addQueryIfNoOtherFilters(intent, keyword, "place");
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
        builder.addQueryIfNoOtherFilters(intent, keyword, "tour");
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
        builder.addQueryIfNoOtherFilters(intent, keyword, "provider");
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

  handleMediaSearch: async (mode, buffer, searchFn, keyword = null) => {
    const prompts = { voice: voicePrompt, image: imagePrompt };

    let modelInput;

    if (mode === "voice") {
      modelInput = [prompts.voice, keyword];
    } else if (mode === "image") {
      const base64 = buffer.toString("base64");
      const mimeType = "image/jpeg";
      modelInput = [prompts.image, { inlineData: { mimeType, data: base64 } }];
    }

    const result = await defaultModel.generateContent(modelInput);
    const text = result.response.text().trim();
    console.log(`${mode.toUpperCase()} AI output:`, text);

    return searchFn(text);
  },
};

module.exports = SearchService;
