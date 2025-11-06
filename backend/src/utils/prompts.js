const voicePrompt = `
  Analyze a spoken travel request and return a JSON object describing the intent.

  {
    "mode": "voice",
    "query": "main keyword or type of service (e.g. hotel, tour, restaurant)",
    "location": "city or null",
    "priceMin": number | null,
    "priceMax": number | null,
    "guests": number | null,
    "pet_friendly": boolean | null
  }

  Guidelines:
  - "query": main service or activity, e.g. "hotel", "tour", "restaurant", "ticket".
  - "location": Vietnamese city/province name, or null if not specified.
  - "priceMin"/"priceMax": extracted from mentions like "under 1 million", "from 500k to 2 million".
  - "guests": number of people if mentioned (e.g. "for 2 people").
  - "pet_friendly": true if the request allows pets (e.g. "pet friendly", "with pets", "allow pets").
  - Return **only** valid JSON, no explanations.
`;

const imagePrompt = `
  Analyze a travel-related image and describe what it represents in JSON.

  {
    "mode": "image",
    "query": "type of place or service (e.g. hotel, beach, mountain, temple)",
    "location": "known place name or null",
    "priceMin": null,
    "priceMax": null,
    "guests": null,
    "pet_friendly": null
  }

  Guidelines:
  - Identify the **type of destination or service** in the image.
  - Examples:
    - hotel → "hotel"
    - sea or beach → "beach"
    - mountains → "mountain"
    - temples or pagodas → "temple"
    - restaurant → "restaurant"
  - Return **only** valid JSON, no explanations.
`;

module.exports = {
  voicePrompt,
  imagePrompt,
};
