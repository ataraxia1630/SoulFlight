const { parseKeywordIntent } = require("./parseKeywordIntent");

const buildIntent = (keyword, location, priceMin, priceMax, guests, filters = {}) => {
  if (
    location !== undefined ||
    priceMin !== undefined ||
    priceMax !== undefined ||
    guests !== undefined
  ) {
    return {
      query: keyword || "",
      location: location || null,
      priceMin: priceMin || null,
      priceMax: priceMax || null,
      guests: guests || null,
      ...filters,
    };
  }
  return parseKeywordIntent(keyword);
};

module.exports = { buildIntent };
