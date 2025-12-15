const { calculateRelevanceScore } = require("./calculateRelevanceScore");
const { UniversalSearchBuilder } = require("./UniversalSearchBuilder");
const { buildIntent } = require("./buildIntent");
const prisma = require("../../configs/prisma");

const rankAndFormat = (items, intent, DTO) => {
  return DTO(
    items
      .map((i) => ({ ...i, _score: calculateRelevanceScore(i, intent) }))
      .sort((a, b) => b._score - a._score)
      .map(({ _score, ...i }) => i),
  );
};

const searchEntity = async (options) => {
  const { keyword, location, priceMin, priceMax, guests, filters, builderFn, prismaFn, DTO } =
    options;

  const intent = buildIntent(keyword, location, priceMin, priceMax, guests, filters);
  console.log(`Final Intent (${DTO.name}):`, intent);

  const builder = new UniversalSearchBuilder();
  if (builderFn) builderFn(builder, intent);

  const where = builder.build();

  let items;
  items = await prismaFn(where);

  // Batch-fetch main images (Room/Place) to avoid N individual queries
  try {
    if (Array.isArray(items) && items.length) {
      const roomIds = items
        .map((s) => s.Rooms?.[0]?.id)
        .filter((id) => id !== undefined && id !== null);

      const placeIds = items
        .map((s) => s.Tours?.[0]?.TourPlace?.[0]?.place_id)
        .filter((id) => id !== undefined && id !== null);

      const ticketPlaceIds = items
        .map((s) => s.Tickets?.[0]?.place_id)
        .filter((id) => id !== undefined && id !== null);

      const placeAllIds = Array.from(new Set([...placeIds, ...ticketPlaceIds]));

      const orConditions = [];
      if (roomIds.length)
        orConditions.push({
          related_type: "Room",
          related_id: { in: roomIds },
        });
      if (placeAllIds.length)
        orConditions.push({
          related_type: "Place",
          related_id: { in: placeAllIds },
        });

      if (orConditions.length) {
        const imgs = await prisma.image.findMany({
          where: { OR: orConditions },
          orderBy: [{ is_main: "desc" }, { position: "asc" }, { created_at: "asc" }],
        });

        const roomMap = new Map();
        const placeMap = new Map();

        for (const img of imgs) {
          const key = img.related_id;
          if (img.related_type === "Room") {
            if (!roomMap.has(key)) roomMap.set(key, img.url);
          } else if (img.related_type === "Place") {
            if (!placeMap.has(key)) placeMap.set(key, img.url);
          }
        }

        // Attach a cached main image to each service according to existing pick logic
        for (const s of items) {
          let main = null;
          const roomId = s.Rooms?.[0]?.id;
          if (roomId && roomMap.has(roomId)) main = roomMap.get(roomId);

          const placeId = s.Tours?.[0]?.TourPlace?.[0]?.place_id;
          if (!main && placeId && placeMap.has(placeId)) main = placeMap.get(placeId);

          if (!main && s.Menus?.[0]?.cover_url) main = s.Menus[0].cover_url;

          if (!main) {
            const menuItem = s.Menus?.[0]?.MenuItems?.[0];
            if (menuItem?.image_url) main = menuItem.image_url;
          }

          const ticketPlaceId = s.Tickets?.[0]?.place_id;
          if (!main && ticketPlaceId && placeMap.has(ticketPlaceId))
            main = placeMap.get(ticketPlaceId);

          s._mainImage = main !== undefined ? main : null;
        }
      }
    }
  } catch {
    console.error("Error batching images for search results");
  }

  return rankAndFormat(items, intent, DTO);
};

module.exports = { searchEntity };
