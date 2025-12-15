const { defaultModel } = require("../../configs/gemini");

class GeminiService {
  constructor() {
    this.model = defaultModel;
  }

  async generateItinerary(userInput) {
    const { destination, startDate, endDate, budget, preferences } = userInput;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const prompt = `
You are a local Vietnamese travel expert who knows ${destination} intimately.

Create a ${days}-day authentic itinerary with REAL places that locals recommend.

USER PREFERENCES:
- Budget: ${budget} VND
- Interests: ${preferences.join(", ")}
- Dates: ${startDate} to ${endDate}

CRITICAL REQUIREMENTS:
1. Use EXACT real place names (e.g., "Bún Chả Hương Liên" not "famous bun cha restaurant")
2. Include local hidden gems, not just tourist traps
3. Add realistic details:
   - Typical ratings (4.2-4.7 for good places)
   - Estimated costs in VND
   - Popular times
   - Local tips in Vietnamese
4. Mix of: must-see attractions, authentic food, local experiences
5. Consider Vietnamese meal times (7:00 breakfast, 11:30 lunch, 18:00 dinner)
6. Total daily cost should fit within budget

OUTPUT FORMAT (JSON only, no markdown):
{
  "itinerarySummary": "Brief overview of the trip vibe",
  "days": [
    {
      "dayNumber": 1,
      "date": "2024-12-15",
      "theme": "Exploring Old Quarter",
      "activities": [
        {
          "time": "07:00",
          "title": "Phở Gia Truyền Bát Đàn",
          "exactAddress": "49 Bát Đàn, Hoàn Kiếm, Hà Nội",
          "description": "Start your day with authentic Hanoi pho. This family-run shop has been serving since 1979. Order the phở bò tái nạm.",
          "type": "restaurant",
          "cuisine": "Vietnamese",
          "duration": 45,
          "estimatedCost": 50000,
          "priceLevel": 1,
          "estimatedRating": 4.6,
          "popularTimes": "6:00-9:00 (đông nhất 7:30)",
          "localTips": [
            "Đến trước 8h để tránh đông",
            "Chỉ nhận tiền mặt",
            "Thử thêm quẩy vào bát phở"
          ],
          "photoKeywords": "pho hanoi vietnam street food",
          "coordinates": {
            "lat": 21.0342,
            "lon": 105.8503
          }
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "accommodation": 1500000,
    "food": 800000,
    "transport": 300000,
    "attractions": 400000,
    "total": 3000000
  },
  "travelTips": [
    "Tải app Grab để đi lại",
    "Luôn mang tiền lẻ (20k, 50k)",
    "Học vài câu tiếng Việt cơ bản"
  ]
}

IMPORTANT: 
- Be specific with addresses (street numbers, district names)
- Ratings should reflect real quality (4.2-4.8 for good, 3.8-4.1 for okay)
- Costs must be realistic for ${destination}
- Include coordinates for each location
- Use Vietnamese for local tips
- Each day should have 4-6 activities including meals
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in AI response");
      }

      const itinerary = JSON.parse(jsonMatch[0]);

      // Validate response structure
      if (!itinerary.days || !Array.isArray(itinerary.days)) {
        throw new Error("Invalid itinerary structure");
      }

      return itinerary;
    } catch (error) {
      console.error("Gemini generation error:", error);
      throw new Error("Failed to generate itinerary: " + error.message);
    }
  }

  async generateAlternatives(activity, destination, preferences) {
    const prompt = `
You are a local expert in ${destination}. 

The user is currently scheduled to visit: "${activity.title}" 
Type: ${activity.type}
Description: ${activity.description}
User interests: ${preferences.join(", ")}

Suggest 4 REAL alternative places of the same type that:
- Are in the same area (within 2-3km if possible)
- Match user interests
- Are authentic and highly rated by locals
- Offer similar experience but with unique twist

Return JSON only:
{
  "alternatives": [
    {
      "title": "Phở Thìn Lò Đúc",
      "exactAddress": "13 Lò Đúc, Hai Bà Trưng, Hà Nội",
      "description": "Another legendary pho spot, famous for stir-fried beef. Different style than original.",
      "type": "${activity.type}",
      "cuisine": "Vietnamese",
      "estimatedRating": 4.5,
      "estimatedCost": 60000,
      "priceLevel": 1,
      "whyBetter": "Nếu bạn thích phở bò xào, phong cách khác biệt. Ít khách du lịch hơn.",
      "bestFor": "Người thích thử các kiểu phở khác nhau",
      "distanceFromOriginal": "1.5km",
      "photoKeywords": "pho thin hanoi beef",
      "coordinates": { "lat": 21.0167, "lon": 105.8456 },
      "localTips": [
        "Gọi phở bò tái lăn",
        "Đến trước 11h30"
      ]
    }
  ]
}

IMPORTANT:
- Must be REAL places with exact addresses
- Include realistic ratings and costs
- Explain why it's a good alternative
- Add local tips in Vietnamese
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in alternatives response");
      }

      const alternatives = JSON.parse(jsonMatch[0]);
      return alternatives;
    } catch (error) {
      console.error("Generate alternatives error:", error);
      throw new Error("Failed to generate alternatives: " + error.message);
    }
  }

  async generateReviews(activity) {
    const prompt = `
Generate 4-5 realistic customer reviews in Vietnamese for this place:

Place: ${activity.title}
Type: ${activity.type}
Description: ${activity.description}
Address: ${activity.exactAddress}
Rating: ${activity.estimatedRating}

Reviews should:
- Sound authentic and conversational Vietnamese
- Mix positive aspects with minor constructive feedback
- Include specific details (dishes, timing, atmosphere, service)
- Vary in length (2-4 sentences)
- Use casual Vietnamese style (không quá formal)
- Different perspectives (solo traveler, family, couple)

Return JSON only:
{
  "reviews": [
    {
      "author": "Minh T.",
      "rating": 5,
      "date": "2 tuần trước",
      "text": "Phở ở đây ngon lắm, nước dùng trong ngọt tự nhiên. Mình hay đến ăn sáng, chỗ đông nhưng phục vụ nhanh. Giá cả hợp lý 50k/bát.",
      "helpful": 12,
      "tags": ["Đồ ăn ngon", "Giá tốt"]
    }
  ]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return { reviews: [] };
      }

      const reviewsData = JSON.parse(jsonMatch[0]);
      return reviewsData;
    } catch (error) {
      console.error("Generate reviews error:", error);
      return { reviews: [] };
    }
  }
}

module.exports = new GeminiService();
