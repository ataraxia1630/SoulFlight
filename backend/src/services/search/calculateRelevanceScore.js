const stringSimilarity = require("string-similarity");

const calculateRelevanceScore = (item, intent) => {
  let score = 0;
  const { query, location, priceMin, priceMax } = intent;

  if (location) {
    const itemLoc = (item.location || item.Provider?.province || "").toLowerCase();
    const searchLoc = location.toLowerCase();

    if (itemLoc.includes(searchLoc)) {
      score += 300;
    } else {
      score -= 200;
    }
  }

  if (query) {
    const q = query.toLowerCase();
    const name = item.name?.toLowerCase() || "";
    const type = item.Type?.name?.toLowerCase() || "";
    const description = (item.description || "").toLowerCase();

    const tags = item.Tags?.map((t) => t.Tag?.name?.toLowerCase()).join(" ") || "";

    if (name.includes(q)) {
      score += 100;
    } else if (type.includes(q)) {
      score += 80;
    } else if (tags.includes(q)) {
      score += 60;
    } else {
      const nameSim = stringSimilarity.compareTwoStrings(name, q);
      const descSim = stringSimilarity.compareTwoStrings(description, q);

      if (nameSim > 0.4) score += nameSim * 50;
      else if (descSim > 0.3) score += descSim * 30;
    }
  }

  if (priceMin || priceMax) {
    const userMin = parseFloat(priceMin) || 0;
    const userMax = parseFloat(priceMax) || Infinity;

    const itemMin = item.price_min || 0;
    const itemMax = item.price_max || item.price_min || 0;

    if (itemMax > 0) {
      if (itemMin <= userMax && itemMax >= userMin) {
        score += 50;
      } else {
        score -= 10;
      }
    }
  }

  if (item.rating) {
    score += item.rating * 2;
  }

  return score;
};

module.exports = { calculateRelevanceScore };
