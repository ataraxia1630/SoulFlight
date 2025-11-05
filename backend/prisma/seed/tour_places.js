const { upsertMany } = require("./utils/upsertMany");

const tourPlaces = [
  // Tour 1 - Mekong Delta Full Day Discovery
  {
    tour_id: 1,
    place_id: 3,
    description: "Morning visit to floating market",
    start_time: "06:00",
    end_time: "08:30",
  },
  {
    tour_id: 1,
    place_id: 8,
    description: "Explore floating village and fish farms",
    start_time: "09:00",
    end_time: "11:00",
  },
  {
    tour_id: 1,
    place_id: 4,
    description: "Lunch and market shopping",
    start_time: "11:30",
    end_time: "13:00",
  },
  {
    tour_id: 1,
    place_id: 10,
    description: "Traditional village visit",
    start_time: "13:30",
    end_time: "15:30",
  },

  // Tour 2 - Sunset River Cruise
  {
    tour_id: 2,
    place_id: 7,
    description: "Scenic cruise on Mekong River",
    start_time: "16:30",
    end_time: "19:00",
  },
  {
    tour_id: 2,
    place_id: 8,
    description: "Pass by floating village",
    start_time: "17:00",
    end_time: "17:30",
  },

  // Tour 3 - Cycling Village Tour
  {
    tour_id: 3,
    place_id: 10,
    description: "Cycle through traditional village",
    start_time: "08:00",
    end_time: "10:00",
  },
  {
    tour_id: 3,
    place_id: 9,
    description: "Visit Long Xuyen city",
    start_time: "10:30",
    end_time: "12:00",
  },

  // Tour 4 - Sam Mountain Spiritual Journey
  {
    tour_id: 4,
    place_id: 1,
    description: "Cable car to mountain peak",
    start_time: "08:00",
    end_time: "10:00",
  },
  {
    tour_id: 4,
    place_id: 6,
    description: "Visit Ba Chua Xu Temple",
    start_time: "10:30",
    end_time: "11:30",
  },
  {
    tour_id: 4,
    place_id: 5,
    description: "Historical tomb visit",
    start_time: "12:00",
    end_time: "13:00",
  },

  // Tour 5 - Tra Su Forest Eco Tour
  {
    tour_id: 5,
    place_id: 2,
    description: "Boat ride through mangrove forest",
    start_time: "07:00",
    end_time: "10:00",
  },
  {
    tour_id: 5,
    place_id: 2,
    description: "Bird watching and nature walk",
    start_time: "10:30",
    end_time: "12:30",
  },

  // Tour 6 - Floating Market Morning Tour
  {
    tour_id: 6,
    place_id: 3,
    description: "Experience bustling floating market",
    start_time: "05:30",
    end_time: "08:00",
  },
  {
    tour_id: 6,
    place_id: 7,
    description: "Cruise back on Mekong River",
    start_time: "08:30",
    end_time: "09:30",
  },

  // Tour 7 - Culinary Adventure Tour
  {
    tour_id: 7,
    place_id: 4,
    description: "Market food tasting",
    start_time: "09:00",
    end_time: "11:00",
  },
  {
    tour_id: 7,
    place_id: 10,
    description: "Traditional cooking demonstration",
    start_time: "11:30",
    end_time: "13:30",
  },

  // Tour 8 - Floating Village Experience
  {
    tour_id: 8,
    place_id: 8,
    description: "Visit floating houses and fish farms",
    start_time: "08:00",
    end_time: "11:00",
  },

  // Tour 9 - Two-Day Mekong Explorer
  {
    tour_id: 9,
    place_id: 3,
    description: "Day 1: Floating market",
    start_time: "06:00",
    end_time: "09:00",
  },
  {
    tour_id: 9,
    place_id: 8,
    description: "Day 1: Floating village",
    start_time: "10:00",
    end_time: "13:00",
  },
  {
    tour_id: 9,
    place_id: 1,
    description: "Day 2: Sam Mountain",
    start_time: "08:00",
    end_time: "12:00",
  },
  {
    tour_id: 9,
    place_id: 2,
    description: "Day 2: Tra Su Forest",
    start_time: "13:00",
    end_time: "16:00",
  },

  // Tour 10 - Photography Tour
  {
    tour_id: 10,
    place_id: 2,
    description: "Landscape and bird photography",
    start_time: "06:00",
    end_time: "09:00",
  },
  {
    tour_id: 10,
    place_id: 8,
    description: "Floating village portraits",
    start_time: "09:30",
    end_time: "12:00",
  },
];

async function seedTourPlaces(prisma) {
  console.log("Seeding tour places...");
  await upsertMany(prisma, prisma.tourPlace, tourPlaces, ["tour_id", "place_id"]);
  console.log(`Seeded ${tourPlaces.length} tour-place associations`);
}

module.exports = { seedTourPlaces };
