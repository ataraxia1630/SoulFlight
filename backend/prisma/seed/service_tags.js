const { upsertMany } = require("./utils/upsertMany");

async function seedServiceOnTags(prisma) {
  console.log("Seeding service-tag associations...");

  const allTags = await prisma.serviceTag.findMany();
  const tagMap = {};
  allTags.forEach((tag) => {
    const key = `${tag.name}_${tag.category}`;
    tagMap[key] = tag.id;
  });

  const associations = [
    // === Service 1 - Sunrise Grand Hotel ===
    { service_id: 1, tag_id: tagMap["hotel_stay/model"] },
    { service_id: 1, tag_id: tagMap["luxury_stay/concept"] },
    { service_id: 1, tag_id: tagMap["modern_stay/concept"] },
    { service_id: 1, tag_id: tagMap["city_center_stay/location"] },
    { service_id: 1, tag_id: tagMap["business_stay/experience"] },

    // === Service 2 - Sunrise Beach Resort ===
    { service_id: 2, tag_id: tagMap["beachfront_stay/nature"] },
    { service_id: 2, tag_id: tagMap["resort_stay/model"] },
    { service_id: 2, tag_id: tagMap["luxury_stay/concept"] },
    { service_id: 2, tag_id: tagMap["private_pool_stay/feature"] },
    { service_id: 2, tag_id: tagMap["romantic_stay/concept"] },

    // === Service 3 - Sunrise Boutique Hotel ===
    { service_id: 3, tag_id: tagMap["hotel_stay/model"] },
    { service_id: 3, tag_id: tagMap["traditional_stay/concept"] },
    { service_id: 3, tag_id: tagMap["cozy_stay/concept"] },
    { service_id: 3, tag_id: tagMap["historic_district_stay/location"] },
    { service_id: 3, tag_id: tagMap["cultural_stay_stay/concept"] },

    // === Service 4 - Sunrise Mountain Lodge ===
    { service_id: 4, tag_id: tagMap["lodge_stay/model"] },
    { service_id: 4, tag_id: tagMap["mountain_view_stay/nature"] },
    { service_id: 4, tag_id: tagMap["cozy_stay/concept"] },
    { service_id: 4, tag_id: tagMap["peaceful_stay/vibe"] },
    { service_id: 4, tag_id: tagMap["relaxation_stay/experience"] },

    // === Service 5 - Sunrise City Apartments ===
    { service_id: 5, tag_id: tagMap["apartment_stay/model"] },
    { service_id: 5, tag_id: tagMap["modern_stay/concept"] },
    { service_id: 5, tag_id: tagMap["long_stay_stay/experience"] },
    { service_id: 5, tag_id: tagMap["remote_work_friendly_stay/experience"] },
    { service_id: 5, tag_id: tagMap["kitchenette_stay/feature"] },

    // === Service 6 - Pho Corner Central ===
    { service_id: 6, tag_id: tagMap["restaurant_fnb/model"] },
    { service_id: 6, tag_id: tagMap["vietnamese_fnb/cuisine"] },
    { service_id: 6, tag_id: tagMap["dine_in_fnb/style"] },
    { service_id: 6, tag_id: tagMap["casual_fnb/atmosphere"] },
    { service_id: 6, tag_id: tagMap["noodles_fnb/specialty"] },

    // === Service 7 - Pho Corner Bistro ===
    { service_id: 7, tag_id: tagMap["bistro_fnb/model"] },
    { service_id: 7, tag_id: tagMap["vietnamese_fnb/cuisine"] },
    { service_id: 7, tag_id: tagMap["fusion_fnb/cuisine"] },
    { service_id: 7, tag_id: tagMap["modern_fnb/atmosphere"] },
    { service_id: 7, tag_id: tagMap["mid_range_fnb/price"] },

    // === Service 8 - Pho Corner Rooftop ===
    { service_id: 8, tag_id: tagMap["fine_dining_fnb/model"] },
    { service_id: 8, tag_id: tagMap["vietnamese_fnb/cuisine"] },
    { service_id: 8, tag_id: tagMap["rooftop_fnb/style"] },
    { service_id: 8, tag_id: tagMap["romantic_fnb/atmosphere"] },
    { service_id: 8, tag_id: tagMap["view_spot_fnb/atmosphere"] },

    // === Service 9 - Pho Corner Coffee ===
    { service_id: 9, tag_id: tagMap["coffee_shop_fnb/model"] },
    { service_id: 9, tag_id: tagMap["coffee_fnb/specialty"] },
    { service_id: 9, tag_id: tagMap["cozy_fnb/atmosphere"] },
    { service_id: 9, tag_id: tagMap["solo_fnb/occasion"] },
    { service_id: 9, tag_id: tagMap["budget_fnb/price"] },

    // === Service 10 - Pho Corner Street Food ===
    { service_id: 10, tag_id: tagMap["street_food_fnb/model"] },
    { service_id: 10, tag_id: tagMap["vietnamese_fnb/cuisine"] },
    { service_id: 10, tag_id: tagMap["local_fnb/cuisine"] },
    { service_id: 10, tag_id: tagMap["casual_fnb/atmosphere"] },
    { service_id: 10, tag_id: tagMap["budget_fnb/price"] },

    // === Service 11 - Mekong Delta Discovery ===
    { service_id: 11, tag_id: tagMap["day_tour_tour/type"] },
    { service_id: 11, tag_id: tagMap["floating_market_tour/attraction"] },
    { service_id: 11, tag_id: tagMap["local_experience_tour/theme"] },
    { service_id: 11, tag_id: tagMap["boat_tour_tour/activity"] },
    { service_id: 11, tag_id: tagMap["culture_tour/theme"] },

    // === Service 12 - Sunset River Cruise ===
    { service_id: 12, tag_id: tagMap["river_cruise_tour/type"] },
    { service_id: 12, tag_id: tagMap["romantic_tour/theme"] },
    { service_id: 12, tag_id: tagMap["evening_tour_tour/time"] },
    { service_id: 12, tag_id: tagMap["boat_tour_tour/activity"] },
    { service_id: 12, tag_id: tagMap["sunset_tour/highlight"] },

    // === Service 13 - Cycling Through Villages ===
    { service_id: 13, tag_id: tagMap["cycling_tour_tour/type"] },
    { service_id: 13, tag_id: tagMap["eco_tour_tour/theme"] },
    { service_id: 13, tag_id: tagMap["local_experience_tour/theme"] },
    { service_id: 13, tag_id: tagMap["half_day_tour_tour/type"] },
    { service_id: 13, tag_id: tagMap["outdoor_tour/activity"] },
  ].filter((assoc) => assoc.tag_id);

  await upsertMany(prisma, prisma.serviceOnTag, associations, ["service_id", "tag_id"]);

  console.log(`Seeded ${associations.length} service-tag associations`);
}

module.exports = { seedServiceOnTags };
