const stringSimilarity = require("string-similarity");

const calculateRelevanceScore = (item, intent, entityType = "service") => {
  let score = 0;
  const { query, location, priceMin, priceMax, guests, pet_friendly } = intent;

  // query relevance
  const q = query?.toLowerCase()?.trim();
  if (q) {
    const textFields = [
      item.name,
      item.title,
      item.description,
      item.service?.name,
      item.Service?.name,
      item.Type?.name,
      item.Place?.name,
      item.Tags?.map((t) => t.Tag?.name).join(" "),
      item.provider?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const similarity = stringSimilarity.compareTwoStrings(textFields, q);

    if (similarity > 0.85) score += 250;
    else if (similarity > 0.6) score += 150;
    else if (textFields.includes(q)) score += 100;
    else if (q.split(" ").some((word) => textFields.includes(word))) score += 50;
    else score += 20;
  } else {
    score += 10;
  }

  // location relevance
  const loc = location?.toLowerCase()?.trim();
  if (loc) {
    const locFields = {
      service: [item.location, item.Provider?.province],
      room: [item.service?.location, item.service?.Provider?.province],
      place: [item.address],
      provider: [item.province],
      default: [
        item.address,
        item.location,
        item.Service?.location,
        item.service?.location,
        item.Place?.address,
      ],
    };

    const locationText = (locFields[entityType] || locFields.default)
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const locSim = stringSimilarity.compareTwoStrings(locationText, loc);

    if (locationText.includes(loc)) score += 200;
    else if (locSim > 0.5) score += 100;
    else score += 30;
  }

  // price
  const hasPriceFilter = priceMin !== null || priceMax !== null;
  if (hasPriceFilter) {
    const min = parseFloat(priceMin) || 0;
    const max = parseFloat(priceMax) || Infinity;

    const priceByType = {
      service: () =>
        item.price_min && item.price_max
          ? (parseFloat(item.price_min) + parseFloat(item.price_max)) / 2
          : parseFloat(item.price_min || item.price_max),
      room: () => parseFloat(item.price_per_night),
      ticket: () => parseFloat(item.price),
      tour: () => parseFloat(item.total_price),
    };

    const itemPrice = priceByType[entityType]?.() ?? null;

    if (itemPrice !== null) {
      if (itemPrice >= min && itemPrice <= max) score += 100;
      else if (itemPrice < min * 1.5 && itemPrice > max / 1.5) score += 30;
    }
  }

  // guest (room)
  if (entityType === "room" && guests !== null && item.max_adult_number) {
    const guestCount = parseInt(guests, 10);
    if (item.max_adult_number >= guestCount) score += 50;
  }

  // pet (room)
  if (entityType === "room" && pet_friendly === "true" && item.pet_allowed) {
    score += 50;
  }

  return Math.max(score, 10);
};

module.exports = { calculateRelevanceScore };
