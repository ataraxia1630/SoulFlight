const { upsertMany } = require("./utils/upsertMany");

const fnbTags = [
  // === fnb/model ===
  { name: "bakery", category: "fnb/model" },
  { name: "bar_pub", category: "fnb/model" },
  { name: "bbq_grill", category: "fnb/model" },
  { name: "bistro", category: "fnb/model" },
  { name: "buffet", category: "fnb/model" },
  { name: "coffee_shop", category: "fnb/model" },
  { name: "court_stall", category: "fnb/model" },
  { name: "casual_dining", category: "fnb/model" },
  { name: "dessert_shop", category: "fnb/model" },
  { name: "fast_food", category: "fnb/model" },
  { name: "fine_dining", category: "fnb/model" },
  { name: "food_truck", category: "fnb/model" },
  { name: "juice_bar", category: "fnb/model" },
  { name: "restaurant", category: "fnb/model" },
  { name: "seafood", category: "fnb/model" },
  { name: "street_food", category: "fnb/model" },
  { name: "tea_house", category: "fnb/model" },
  { name: "vegan", category: "fnb/model" },

  // === fnb/cuisine === (Cuisine Type)
  { name: "vietnamese", category: "fnb/cuisine" },
  { name: "thai", category: "fnb/cuisine" },
  { name: "japanese", category: "fnb/cuisine" },
  { name: "korean", category: "fnb/cuisine" },
  { name: "chinese", category: "fnb/cuisine" },
  { name: "italian", category: "fnb/cuisine" },
  { name: "french", category: "fnb/cuisine" },
  { name: "indian", category: "fnb/cuisine" },
  { name: "western", category: "fnb/cuisine" },
  { name: "fusion", category: "fnb/cuisine" },
  { name: "local", category: "fnb/cuisine" },
  { name: "mediterranean", category: "fnb/cuisine" },
  { name: "mexican", category: "fnb/cuisine" },

  // === fnb/style === (Service Style)
  { name: "dine_in", category: "fnb/style" },
  { name: "takeaway", category: "fnb/style" },
  { name: "delivery", category: "fnb/style" },
  { name: "self_service", category: "fnb/style" },
  { name: "buffet", category: "fnb/style" },
  { name: "table_service", category: "fnb/style" },
  { name: "drive_thru", category: "fnb/style" },
  { name: "outdoor_seating", category: "fnb/style" },
  { name: "rooftop", category: "fnb/style" },
  { name: "private_dining", category: "fnb/style" },

  // === fnb/atmosphere ===
  { name: "casual", category: "fnb/atmosphere" },
  { name: "cozy", category: "fnb/atmosphere" },
  { name: "family_friendly", category: "fnb/atmosphere" },
  { name: "romantic", category: "fnb/atmosphere" },
  { name: "luxury", category: "fnb/atmosphere" },
  { name: "traditional", category: "fnb/atmosphere" },
  { name: "modern", category: "fnb/atmosphere" },
  { name: "quiet", category: "fnb/atmosphere" },
  { name: "lively", category: "fnb/atmosphere" },
  { name: "view_spot", category: "fnb/atmosphere" },
  { name: "pet_friendly", category: "fnb/atmosphere" },

  // === fnb/specialty ===
  { name: "seafood", category: "fnb/specialty" },
  { name: "bbq", category: "fnb/specialty" },
  { name: "hotpot", category: "fnb/specialty" },
  { name: "noodles", category: "fnb/specialty" },
  { name: "rice_dishes", category: "fnb/specialty" },
  { name: "coffee", category: "fnb/specialty" },
  { name: "pastry", category: "fnb/specialty" },
  { name: "dessert", category: "fnb/specialty" },
  { name: "vegan", category: "fnb/specialty" },
  { name: "gluten_free", category: "fnb/specialty" },
  { name: "halal", category: "fnb/specialty" },
  { name: "organic", category: "fnb/specialty" },
  { name: "healthy", category: "fnb/specialty" },

  // === fnb/occasion ===
  { name: "breakfast", category: "fnb/occasion" },
  { name: "lunch", category: "fnb/occasion" },
  { name: "dinner", category: "fnb/occasion" },
  { name: "brunch", category: "fnb/occasion" },
  { name: "late_night", category: "fnb/occasion" },
  { name: "couple", category: "fnb/occasion" },
  { name: "family", category: "fnb/occasion" },
  { name: "friends", category: "fnb/occasion" },
  { name: "group", category: "fnb/occasion" },
  { name: "solo", category: "fnb/occasion" },

  // === fnb/price ===
  { name: "budget", category: "fnb/price" },
  { name: "mid_range", category: "fnb/price" },
  { name: "premium", category: "fnb/price" },
  { name: "fine_dining", category: "fnb/price" },
];

async function seedFnbTags(prisma) {
  console.log("Seeding F&B tags...");
  await upsertMany(prisma, prisma.serviceTag, fnbTags, ["name", "category"]);
  console.log(`Seeded ${fnbTags.length} F&B tags`);
}

module.exports = { seedFnbTags };
