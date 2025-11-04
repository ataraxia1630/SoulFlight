const voicePrompt = `
  You are a travel search assistant. 
  Analyze this voice recording and return ONLY a JSON object with:
  {
    "searchQuery": "main keyword user wants to search",
    "location": "city or place mentioned",
    "filters": { "pet_friendly": true, "price": "0-1000000", ... }
  }
  Example: {"searchQuery": "spa", "location": "Đà Lạt", "filters": {}}
`;

const imagePrompt = `
  You are a travel search assistant.
  Analyze this image and return ONLY a JSON object with:
  {
    "searchQuery": "what user wants to find",
    "location": "where it is",
    "filters": { "type": "Hotel", "rating_min": "4.0", ... }
  }
  Example: {"searchQuery": "beach resort", "location": "Phú Quốc", "filters": {}}
`;

module.exports = {
  voicePrompt,
  imagePrompt,
};
