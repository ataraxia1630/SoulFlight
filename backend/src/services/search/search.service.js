const prisma = require("../../configs/prisma");
const { defaultModel } = require("../../configs/gemini");
const { searchIntentPrompt, imageSearchPrompt } = require("../../utils/prompts");
const { calculateRelevanceScore } = require("./calculateRelevanceScore");
const { SearchServiceDTO } = require("../../dtos/search.dto");

// text, voice
const extractIntentWithAI = async (keyword, manualFilters) => {
  try {
    if (!keyword || !keyword.trim()) return { query: "", ...manualFilters };
    const prompt = searchIntentPrompt.replace("{keyword}", keyword);
    const result = await defaultModel.generateContent(prompt);
    const jsonString = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Text Intent Error:", error);
    return { query: keyword, ...manualFilters };
  }
};

// image
const extractIntentFromImage = async (fileBuffer, manualFilters) => {
  try {
    const imagePart = {
      inlineData: {
        data: fileBuffer.toString("base64"),
        mimeType: "image/jpeg",
      },
    };
    const result = await defaultModel.generateContent([imageSearchPrompt, imagePart]);
    const jsonString = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Image Intent Error:", error);
    return { query: "", ...manualFilters };
  }
};

const SearchService = {
  searchServices: async (
    keyword,
    location,
    priceMin,
    priceMax,
    guests,
    _filters,
    travelerId,
    mode = "text",
    fileBuffer = null,
  ) => {
    let aiIntent;
    const manualFilters = { location, priceMin, priceMax, guests };

    if (mode === "image" && fileBuffer) {
      aiIntent = await extractIntentFromImage(fileBuffer, manualFilters);
    } else {
      aiIntent = await extractIntentWithAI(keyword, manualFilters);
    }

    // ưu tiên filter
    const intent = {
      query: aiIntent.query || keyword || "",
      location: manualFilters.location || aiIntent.location,
      priceMin: manualFilters.priceMin || aiIntent.priceMin,
      priceMax: manualFilters.priceMax || aiIntent.priceMax,
      guests: manualFilters.guests || aiIntent.guests,
    };

    console.log("Raw Intent:", intent);
    let { query: q, location: loc } = intent;

    if (q) {
      // xóa location
      if (loc) {
        const locRegex = new RegExp(loc, "gi");
        q = q.replace(locRegex, "");
      }

      // xóa price (nếu thấy đơn vị tiền tệ)
      q = q.replace(/\b\d+(?:[.,]\d+)?\s*(?:k|tr|triệu|tỷ|vnd|đ|usd|\$)\b/gi, "");

      // xóa guest
      q = q.replace(/\b\d+\s*(?:người|khách|pax|guest|guests?)\b/gi, "");

      // xóa stopword
      q = q.replace(
        /\b(du lịch|travel|tourist|trip|đi|ở|tại|tìm|kiếm|giá|tầm|khoảng|dưới|trên|cho|với)\b/gi,
        "",
      );

      // clean
      q = q.replace(/[,.-]/g, " ").replace(/\s+/g, " ").trim();
    }

    console.log(`Cleaned Query: "${q}"`);

    const whereClause = { AND: [] };

    if (loc) {
      whereClause.AND.push({
        OR: [
          { location: { contains: loc, mode: "insensitive" } },
          { Provider: { province: { contains: loc, mode: "insensitive" } } },
        ],
      });
    }

    if (q && q.length > 1) {
      whereClause.AND.push({
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { Type: { name: { contains: q, mode: "insensitive" } } },
          { Tags: { some: { Tag: { name: { contains: q, mode: "insensitive" } } } } },
        ],
      });
    }

    if (intent.priceMin || intent.priceMax) {
      const min = parseFloat(intent.priceMin) || 0;
      const max = parseFloat(intent.priceMax) || Number.MAX_SAFE_INTEGER;
      whereClause.AND.push({
        OR: [
          { AND: [{ price_min: { lte: max } }, { price_max: { gte: min } }] },
          { price_min: null },
        ],
      });
    }

    if (intent.guests) {
      const guestCount = parseInt(intent.guests, 10);
      whereClause.AND.push({
        OR: [
          { Rooms: { some: { max_adult_number: { gte: guestCount } } } },
          { Rooms: { none: {} } },
        ],
      });
    }

    whereClause.AND.push({
      OR: [
        { Rooms: { some: { status: "AVAILABLE" } } },
        { Tours: { some: { status: "AVAILABLE" } } },
        { Tickets: { some: { status: "AVAILABLE" } } },
        { Menus: { some: { MenuItems: { some: { status: "AVAILABLE" } } } } },
      ],
    });

    const items = await prisma.service.findMany({
      where: whereClause,
      include: {
        Type: true,
        Provider: { include: { user: { select: { name: true } } } },
        Tags: { include: { Tag: true } },
        Wishlists: travelerId ? { where: { traveler_id: travelerId } } : false,
        Tours: { where: { status: "AVAILABLE" }, include: { TourPlace: true } },
        Rooms: { where: { status: "AVAILABLE" } },
        Tickets: { where: { status: "AVAILABLE" } },
        Menus: { include: { MenuItems: { where: { status: "AVAILABLE" } } } },
        Vouchers: { where: { valid_to: { gte: new Date() } } },
      },
    });

    // lấy ảnh
    const roomIds = [];
    const placeIds = [];

    items.forEach((s) => {
      if (s.Rooms?.length) roomIds.push(s.Rooms[0].id);
      if (s.Tours?.length && s.Tours[0].TourPlace?.length)
        placeIds.push(s.Tours[0].TourPlace[0].place_id);
      if (s.Tickets?.length) placeIds.push(s.Tickets[0].place_id);
    });

    let images = [];
    if (roomIds.length > 0 || placeIds.length > 0) {
      images = await prisma.image.findMany({
        where: {
          OR: [
            { related_type: "Room", related_id: { in: roomIds } },
            { related_type: "Place", related_id: { in: placeIds } },
          ],
        },
        orderBy: [{ is_main: "desc" }, { position: "asc" }],
      });
    }

    items.forEach((s) => {
      let mainImg = null;
      if (s.Rooms?.length) {
        const img = images.find((i) => i.related_type === "Room" && i.related_id === s.Rooms[0].id);
        if (img) mainImg = img.url;
      }
      if (!mainImg) {
        let pId = null;
        if (s.Tours?.length && s.Tours[0].TourPlace?.length) pId = s.Tours[0].TourPlace[0].place_id;
        else if (s.Tickets?.length) pId = s.Tickets[0].place_id;
        if (pId) {
          const img = images.find((i) => i.related_type === "Place" && i.related_id === pId);
          if (img) mainImg = img.url;
        }
      }
      if (!mainImg && s.Menus?.length) {
        if (s.Menus[0].cover_url) mainImg = s.Menus[0].cover_url;
        else if (s.Menus[0].MenuItems?.length) mainImg = s.Menus[0].MenuItems[0].image_url;
      }
      s._mainImage = mainImg;
    });

    const rankedItems = items
      .map((item) => ({ ...item, _score: calculateRelevanceScore(item, intent) }))
      .sort((a, b) => b._score - a._score);

    return SearchServiceDTO(rankedItems, travelerId);
  },
};

module.exports = SearchService;
