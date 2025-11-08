const voicePrompt = `
  Analyze sentences and return JSON.

  Format:
  {
    "mode": "image",
    "query": "what you see (hotel, beach, restaurant, mountain, temple, pho, etc.)",
    "location": "Vietnamese province or null",
    "priceMin": null,
    "priceMax": null,
    "guests": null,
    "pet_friendly": null
  }

  Rules:
  - query: Identify EXACT service/place type (use simple keywords: hotel, cafe, beach, mountain, NOT compound words)
  - location: ONLY if you recognize specific province (An Giang, Hà Nội, TP.Hồ Chí Minh, Đà Nẵng, Ninh Bình, etc.), else null
  - DON'T invent location names (no "Mekong Delta", "Northern Vietnam", etc.)
  - DON'T create compound queries (use "boat" NOT "river tour", use "temple" NOT "ancient temple")
  - Return ONLY valid JSON, no markdown

  Examples:
  Luxury pool with mountains → {"mode":"image","query":"resort","location":null,"priceMin":null,"priceMax":null,"guests":null,"pet_friendly":null}
  Boat on river with vendors → {"mode":"image","query":"boat","location":null,"priceMin":null,"priceMax":null,"guests":null,"pet_friendly":null}
  Vietnamese pho bowl → {"mode":"image","query":"pho","location":null,"priceMin":null,"priceMax":null,"guests":null,"pet_friendly":null}
  Hoan Kiem Lake → {"mode":"image","query":"lake","location":"Hà Nội","priceMin":null,"priceMax":null,"guests":null,"pet_friendly":null}
`;

const imagePrompt = `
  Analyze travel image and return JSON.

  Format:
  {
    "mode": "image",
    "query": "what you see (hotel, beach, restaurant, mountain, temple, pho, etc.)",
    "location": "Vietnamese province or null",
    "priceMin": null,
    "priceMax": null,
    "guests": null,
    "pet_friendly": null
  }

  Rules:
  - query: Identify EXACT service/place type (use simple keywords: hotel, cafe, beach, mountain, NOT compound words)
  - location: ONLY if you recognize specific province (An Giang, Hà Nội, TP.Hồ Chí Minh, Đà Nẵng, Ninh Bình, etc.), else null
  - DON'T invent location names (no "Mekong Delta", "Northern Vietnam", etc.)
  - DON'T create compound queries (use "boat" NOT "river tour", use "temple" NOT "ancient temple")
  - Return ONLY valid JSON, no markdown

  Examples:
  Luxury pool with mountains → {"mode":"image","query":"resort","location":null,"priceMin":null,"priceMax":null,"guests":null,"pet_friendly":null}
  Boat on river with vendors → {"mode":"image","query":"boat","location":null,"priceMin":null,"priceMax":null,"guests":null,"pet_friendly":null}
  Vietnamese pho bowl → {"mode":"image","query":"pho","location":null,"priceMin":null,"priceMax":null,"guests":null,"pet_friendly":null}
  Hoan Kiem Lake → {"mode":"image","query":"lake","location":"Hà Nội","priceMin":null,"priceMax":null,"guests":null,"pet_friendly":null}
`;

module.exports = {
  voicePrompt,
  imagePrompt,
};
