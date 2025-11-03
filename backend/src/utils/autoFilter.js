const applyFilters = (builder, filters = {}) => {
  if (filters.price) {
    const [min, max] = filters.price.split("-").map(Number);
    if (!Number.isNaN(min) && !Number.isNaN(max)) {
      builder.where.AND.push({
        AND: [{ price_min: { gte: min } }, { price_max: { lte: max } }],
      });
    }
  }

  if (filters.type) {
    const typeId = parseInt(filters.type, 10);
    if (!Number.isNaN(typeId)) {
      builder.where.AND.push({ type_id: typeId });
    }
  }

  if (filters.rating_min) {
    const min = parseFloat(filters.rating_min);
    if (!Number.isNaN(min)) builder.where.AND.push({ rating: { gte: min } });
  }
  if (filters.rating_max) {
    const max = parseFloat(filters.rating_max);
    if (!Number.isNaN(max)) builder.where.AND.push({ rating: { lte: max } });
  }

  if (filters.pet_friendly === "true") {
    builder.where.AND.push({ Rooms: { some: { pet_allowed: true } } });
  }

  if (filters.tag) {
    const tags = JSON.parse(filters.tag);
    Object.entries(tags).forEach(([category, value]) => {
      builder.where.AND.push({
        Tags: {
          some: {
            Tag: { category, name: { contains: value, mode: "insensitive" } },
          },
        },
      });
    });
  }

  if (filters.lifestyle === "true") {
    builder.where.AND.push({
      Tags: { some: { Tag: { category: "Lifestyle" } } },
    });
  }
  if (filters.cross_tour_stay === "true") {
    builder.where.AND.push({ Tour: { some: {} } });
  }

  return builder;
};

module.exports = { applyFilters };
