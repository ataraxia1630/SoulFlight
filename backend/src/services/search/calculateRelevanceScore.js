const stringSimilarity = require("string-similarity");

const calculateRelevanceScore = (item, intent, entityType = "service") => {
  let score = 0;
  const { query, location, priceMin, priceMax, guests, pet_friendly } = intent;

  const hasLocationFilter = location !== null && location !== undefined;
  const hasPriceFilter = priceMin !== null || priceMax !== null;
  const hasGuestsFilter = guests !== null && guests !== undefined;
  const hasPetFilter = pet_friendly === true;

  const hasAnyFilter = hasLocationFilter || hasPriceFilter || hasGuestsFilter || hasPetFilter;

  // location
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

    if (locationText.includes(loc)) score += 300;
    else if (locSim > 0.5) score += 150;
    else score += 50;
  }

  // price
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
      if (itemPrice >= min && itemPrice <= max) score += 200;
      else if (itemPrice < min * 1.5 && itemPrice > max / 1.5) score += 80;
      else score += 20;
    }
  }

  if (entityType === "room" && hasGuestsFilter && item.max_adult_number) {
    const guestCount = parseInt(guests, 10);
    if (item.max_adult_number >= guestCount) score += 150;
    else score += 30;
  }

  if (entityType === "room" && hasPetFilter) {
    if (item.pet_allowed) score += 200;
    else score += 30;
  }

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

    if (similarity > 0.85) score += 100;
    else if (similarity > 0.6) score += 60;
    else if (textFields.includes(q)) score += 40;
    else if (q.split(" ").some((word) => textFields.includes(word))) score += 20;
    else if (hasAnyFilter) score += 10;
  } else {
    if (hasAnyFilter) score += 50;
    else score += 10;
  }

  return Math.max(score, 10);
};

module.exports = { calculateRelevanceScore };
