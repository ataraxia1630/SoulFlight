const voicePrompt = `
  Analyze sentences (Vietnamese or English) and return JSON with travel intent.

  Format:
  {
    "mode": "voice",
    "query": "main keyword (hotel, tour, restaurant, cafe, beach, etc.)",
    "location": "province name or null",
    "priceMin": number | null,
    "priceMax": number | null,
    "guests": number | null,
    "pet_friendly": boolean | null
  }

  Rules:
  - query: Extract main service/place type
  - location: Vietnamese province (An Giang, Ninh Bình, Hà Nội)
  - price: 
    VN: "dưới 1 triệu"→max:1000000, "từ 500k đến 2tr"→min:500000,max:2000000
    EN: "under 1 million"→max:1000000, "from 500k to 2m"→min:500000,max:2000000
  - guests: Extract number from "2 người"/"for 2 people"
  - pet_friendly: true if mentioned ("cho phép thú cưng"/"pet friendly"/"allow pets")
  - Return ONLY valid JSON, no markdown

  Examples:
  "Khách sạn Ninh Bình 1 triệu cho 2 người" → {"mode":"voice","query":"hotel","location":"Ninh Bình","priceMin":1000000,"priceMax":1000000,"guests":2,"pet_friendly":null}
  "Hotel in Hanoi under 1 million for 2 guests" → {"mode":"voice","query":"hotel","location":"Hà Nội","priceMin":null,"priceMax":1000000,"guests":2,"pet_friendly":null}
  "Quán phở An Giang pet friendly" → {"mode":"voice","query":"pho","location":"An Giang","priceMin":null,"priceMax":null,"guests":null,"pet_friendly":true}
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
