const { upsertMany } = require("./utils/upsertMany");

const tourTags = [
  // === tour/model ===
  { name: "day_tour", category: "tour/model" },
  { name: "package_tour", category: "tour/model" },
  { name: "group_tour", category: "tour/model" },
  { name: "private_tour", category: "tour/model" },
  { name: "adventure_tour", category: "tour/model" },
  { name: "cultural_tour", category: "tour/model" },
  { name: "eco_tour", category: "tour/model" },
  { name: "food_tour", category: "tour/model" },
  { name: "walking_tour", category: "tour/model" },
  { name: "city_tour", category: "tour/model" },
  { name: "cruise_tour", category: "tour/model" },
  { name: "luxury_tour", category: "tour/model" },
  { name: "budget_tour", category: "tour/model" },
  { name: "multi_day_tour", category: "tour/model" },
];

async function seedTourTagsV2(prisma) {
  console.log("Seeding Tour tags...");
  await upsertMany(prisma, prisma.serviceTag, tourTags, ["name", "category"]);
  console.log(`Seeded ${tourTags.length} Tour tags V2`);
}

module.exports = { seedTourTagsV2 };
