const { upsertMany } = require("./utils/upsertMany");

const tourTags = [
  // Tour tags
  {
    name: "day_tour",
    category: "tour/type",
  },
  {
    name: "half_day_tour",
    category: "tour/type",
  },
  {
    name: "multi_day_tour",
    category: "tour/type",
  },
  {
    name: "cycling_tour",
    category: "tour/type",
  },
  {
    name: "river_cruise",
    category: "tour/type",
  },
  {
    name: "boat_tour",
    category: "tour/activity",
  },
  {
    name: "floating_market",
    category: "tour/attraction",
  },
  {
    name: "local_experience",
    category: "tour/theme",
  },
  {
    name: "eco_tour",
    category: "tour/theme",
  },
  {
    name: "culture",
    category: "tour/theme",
  },
  {
    name: "romantic",
    category: "tour/theme",
  },
  {
    name: "adventure",
    category: "tour/theme",
  },
  {
    name: "sunset",
    category: "tour/highlight",
  },
  {
    name: "sunrise",
    category: "tour/highlight",
  },
  {
    name: "morning_tour",
    category: "tour/time",
  },
  {
    name: "evening_tour",
    category: "tour/time",
  },
  {
    name: "guided_tour",
    category: "tour/experience",
  },
  {
    name: "private_tour",
    category: "tour/experience",
  },
  {
    name: "group_tour",
    category: "tour/experience",
  },
  {
    name: "outdoor",
    category: "tour/activity",
  },
];

async function seedTourTags(prisma) {
  console.log("Seeding tour tags...");

  await upsertMany(prisma, prisma.serviceTag, tourTags, ["name", "category"]);
  console.log(`Seeded ${tourTags.length} tour/attraction tags`);
}

module.exports = { seedTourTags };
