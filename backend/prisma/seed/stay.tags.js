const { upsertMany } = require("./utils/upsertMany");

const stayTags = [
  // stay/nature
  { name: "beachfront", category: "stay/nature" },
  { name: "seaside", category: "stay/nature" },
  { name: "ocean_view", category: "stay/nature" },
  { name: "lake_view", category: "stay/nature" },
  { name: "riverfront", category: "stay/nature" },
  { name: "mountain_view", category: "stay/nature" },
  { name: "valley_view", category: "stay/nature" },
  { name: "forest_retreat", category: "stay/nature" },
  { name: "jungle_stay", category: "stay/nature" },
  { name: "hilltop", category: "stay/nature" },
  { name: "countryside", category: "stay/nature" },
  { name: "garden_view", category: "stay/nature" },
  { name: "island_stay", category: "stay/nature" },
  { name: "desert_escape", category: "stay/nature" },
  { name: "cliffside", category: "stay/nature" },

  // stay/concept
  { name: "modern", category: "stay/concept" },
  { name: "minimalist", category: "stay/concept" },
  { name: "traditional", category: "stay/concept" },
  { name: "rustic", category: "stay/concept" },
  { name: "vintage", category: "stay/concept" },
  { name: "luxury", category: "stay/concept" },
  { name: "cozy", category: "stay/concept" },
  { name: "romantic", category: "stay/concept" },
  { name: "eco_friendly", category: "stay/concept" },
  { name: "pet_friendly", category: "stay/concept" },
  { name: "family_friendly", category: "stay/concept" },
  { name: "adults_only", category: "stay/concept" },
  { name: "smart_stay", category: "stay/concept" },
  { name: "wellness", category: "stay/concept" },
  { name: "spiritual_retreat", category: "stay/concept" },
  { name: "cultural_stay", category: "stay/concept" },

  // stay/experience
  { name: "short_stay", category: "stay/experience" },
  { name: "long_stay", category: "stay/experience" },
  { name: "business_stay", category: "stay/experience" },
  { name: "couple_getaway", category: "stay/experience" },
  { name: "family_vacation", category: "stay/experience" },
  { name: "group_stay", category: "stay/experience" },
  { name: "solo_travel", category: "stay/experience" },
  { name: "weekend_escape", category: "stay/experience" },
  { name: "relaxation", category: "stay/experience" },
  { name: "adventure", category: "stay/experience" },
  { name: "digital_nomad", category: "stay/experience" },
  { name: "remote_work_friendly", category: "stay/experience" },

  // stay/feature
  { name: "private_pool", category: "stay/feature" },
  { name: "hot_spring", category: "stay/feature" },
  { name: "spa_access", category: "stay/feature" },
  { name: "rooftop_terrace", category: "stay/feature" },
  { name: "balcony_room", category: "stay/feature" },
  { name: "breakfast_included", category: "stay/feature" },
  { name: "all_inclusive", category: "stay/feature" },
  { name: "kitchenette", category: "stay/feature" },
  { name: "parking_available", category: "stay/feature" },
  { name: "pet_accommodation", category: "stay/feature" },

  // stay/location
  { name: "city_center", category: "stay/location" },
  { name: "urban_area", category: "stay/location" },
  { name: "downtown", category: "stay/location" },
  { name: "suburban_area", category: "stay/location" },
  { name: "rural_area", category: "stay/location" },
  { name: "coastal_town", category: "stay/location" },
  { name: "historic_district", category: "stay/location" },
  { name: "cultural_village", category: "stay/location" },
  { name: "scenic_spot", category: "stay/location" },
  { name: "near_landmark", category: "stay/location" },
  { name: "near_airport", category: "stay/location" },
  { name: "near_station", category: "stay/location" },

  // stay/vibe
  { name: "peaceful", category: "stay/vibe" },
  { name: "quiet_area", category: "stay/vibe" },
  { name: "lively_neighborhood", category: "stay/vibe" },
  { name: "hidden_gem", category: "stay/vibe" },
  { name: "remote_location", category: "stay/vibe" },
  { name: "nature_immersed", category: "stay/vibe" },
  { name: "local_living", category: "stay/vibe" },
  { name: "eco_friendly_zone", category: "stay/vibe" },
  { name: "adventure_base", category: "stay/vibe" },
  { name: "romantic_setting", category: "stay/vibe" },

  // stay/model
  { name: "apartment", category: "stay/model" },
  { name: "cabin", category: "stay/model" },
  { name: "camp", category: "stay/model" },
  { name: "cottage", category: "stay/model" },
  { name: "farm_stay", category: "stay/model" },
  { name: "homestay", category: "stay/model" },
  { name: "hostel", category: "stay/model" },
  { name: "hotel", category: "stay/model" },
  { name: "lodge", category: "stay/model" },
  { name: "motel", category: "stay/model" },
  { name: "resort", category: "stay/model" },
  { name: "retreat", category: "stay/model" },
  { name: "villa", category: "stay/model" },
];

async function seedStayTags(prisma) {
  console.log("Seeding stay tags...");
  await upsertMany(prisma, prisma.serviceTag, stayTags, ["name", "category"]);
  console.log(`Seeded ${stayTags.length} stay tags`);
}

module.exports = { seedStayTags, stayTags };
