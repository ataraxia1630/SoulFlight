const searchIntentPrompt = `
  Analyze the Vietnamese search query and extract intent into JSON.
  Query: "{keyword}"
  Format:
  {
    "query": "core keywords for name/type (e.g., 'khách sạn', 'phở', 'tour đảo')",
    "location": "Province/City name in Vietnam or null",
    "priceMin": number or null,
    "priceMax": number or null,
    "guests": number or null
  }
  Rules:
  - Remove stop words.
  - Identify numbers for price.
  - Return ONLY valid JSON.
`;

const imageSearchPrompt = `
  Analyze this image for a travel app and extract intent into JSON.
  
  Format:
  {
    "query": "specific object/service type (e.g., 'resort', 'biển', 'chùa', 'món ăn', 'núi')",
    "location": "Specific famous location in Vietnam if recognized (e.g., 'An Giang', 'Đà Lạt') or null",
    "priceMin": null,
    "priceMax": null,
    "guests": null
  }

  Rules:
  - "query": describe what is IN the image (visual elements). DO NOT include the location name here. DO NOT use generic words like "Du lịch", "Travel".
  - "location": Only strictly identified famous landmarks/cities.
  - Example: If image is Ha Long Bay -> query: "vịnh, biển, du thuyền", location: "Quảng Ninh".
  - Return ONLY valid JSON.
`;

module.exports = {
  searchIntentPrompt,
  imageSearchPrompt,
};
