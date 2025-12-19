const { upsertMany } = require("./utils/upsertMany");

const tours = [
  {
    name: "Mekong Delta Full Day Discovery",
    description: "Comprehensive tour of floating markets, villages, and traditional crafts",
    service_price: 850000,
    total_price: 1200000,
    status: "AVAILABLE",
    service_id: 11,
    tourguide_id: 1,
  },
  {
    name: "Sunset River Cruise",
    description: "Romantic evening cruise with dinner on the Mekong River",
    service_price: 650000,
    total_price: 900000,
    status: "AVAILABLE",
    service_id: 12,
    tourguide_id: 2,
  },
  {
    name: "Cycling Village Tour",
    description: "Explore rural life by bicycle with stops at local homes",
    service_price: 450000,
    total_price: 600000,
    status: "AVAILABLE",
    service_id: 13,
    tourguide_id: 3,
  },
  {
    name: "Sam Mountain Spiritual Journey",
    description: "Visit temples and pagodas on sacred Sam Mountain",
    service_price: 380000,
    total_price: 550000,
    status: "AVAILABLE",
    service_id: 14,
    tourguide_id: 1,
  },
  {
    name: "Tra Su Forest Eco Tour",
    description: "Bird watching and nature exploration in cajuput forest",
    service_price: 520000,
    total_price: 750000,
    status: "AVAILABLE",
    service_id: 15,
    tourguide_id: 4,
  },
  {
    name: "Floating Market Morning Tour",
    description: "Early morning visit to bustling Cai Rang floating market",
    service_price: 420000,
    total_price: 580000,
    status: "AVAILABLE",
    service_id: 11,
    tourguide_id: 2,
  },
  {
    name: "Culinary Adventure Tour",
    description: "Food tasting tour through local markets and restaurants",
    service_price: 550000,
    total_price: 800000,
    status: "AVAILABLE",
    service_id: 11,
    tourguide_id: 5,
  },
  {
    name: "Floating Village Experience",
    description: "Visit fish farms and floating houses on the river",
    service_price: 380000,
    total_price: 520000,
    status: "AVAILABLE",
    service_id: 11,
    tourguide_id: 3,
  },
  {
    name: "Two-Day Mekong Explorer",
    description: "Extended tour covering multiple provinces with homestay",
    service_price: 1800000,
    total_price: 2500000,
    status: "AVAILABLE",
    service_id: 11,
    tourguide_id: 1,
  },
  {
    name: "Photography Tour",
    description: "Capture the beauty of Mekong Delta with expert guidance",
    service_price: 680000,
    total_price: 950000,
    status: "AVAILABLE",
    service_id: 11,
    tourguide_id: 4,
  },
];

async function seedTours(prisma) {
  console.log("Seeding tours...");

  await upsertMany(prisma, prisma.tour, tours, ["name", "service_id"]);
  console.log(`Seeded ${tours.length} tours`);
}

module.exports = { seedTours };
