const { upsertMany } = require("./utils/upsertMany");

const leisureTags = [
  // === leisure/model === (Ticket types for attractions/activities)
  { name: "theme_park", category: "leisure/model" },
  { name: "water_park", category: "leisure/model" },
  { name: "museum", category: "leisure/model" },
  { name: "zoo_aquarium", category: "leisure/model" },
  { name: "historical_site", category: "leisure/model" },
  { name: "art_gallery", category: "leisure/model" },
  { name: "workshop_class", category: "leisure/model" },
  { name: "spa_wellness", category: "leisure/model" },
  { name: "performance_show", category: "leisure/model" },
  { name: "outdoor_activity", category: "leisure/model" },
  { name: "indoor_playground", category: "leisure/model" },
  { name: "observation_deck", category: "leisure/model" },
  { name: "extreme_sport", category: "leisure/model" },
  { name: "cinema", category: "leisure/model" },
];

async function seedLeisureTags(prisma) {
  console.log("Seeding Leisure tags...");
  await upsertMany(prisma, prisma.serviceTag, leisureTags, ["name", "category"]);
  console.log(`Seeded ${leisureTags.length} Leisure tags`);
}

module.exports = { seedLeisureTags };
