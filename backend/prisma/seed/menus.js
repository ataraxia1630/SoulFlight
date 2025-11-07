const { upsertMany } = require("./utils/upsertMany");

const menus = [
  // Pho Corner Central menus
  {
    name: "Traditional Pho Menu",
    description: "Authentic Vietnamese pho with various meat options",
    cover_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43",
    service_id: 6,
  },
  {
    name: "Side Dishes & Appetizers",
    description: "Vietnamese spring rolls and appetizers",
    cover_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb",
    service_id: 6,
  },

  // Pho Corner Bistro menus
  {
    name: "Fusion Dishes",
    description: "Modern Vietnamese cuisine with international twist",
    cover_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    service_id: 7,
  },
  {
    name: "Premium Selection",
    description: "High-quality ingredients and special preparations",
    cover_url: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
    service_id: 7,
  },

  // Pho Corner Rooftop menus
  {
    name: "Fine Dining Menu",
    description: "Exquisite Vietnamese dishes for special occasions",
    cover_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    service_id: 8,
  },
  {
    name: "Wine & Cocktails",
    description: "Carefully selected wines and signature cocktails",
    cover_url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187",
    service_id: 8,
  },

  // Pho Corner Coffee menus
  {
    name: "Coffee Selection",
    description: "Traditional and modern Vietnamese coffee",
    cover_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
    service_id: 9,
  },
  {
    name: "Pastries & Desserts",
    description: "Fresh baked goods and sweet treats",
    cover_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    service_id: 9,
  },

  // Pho Corner Street Food menus
  {
    name: "Street Food Classics",
    description: "Popular Vietnamese street food favorites",
    cover_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    service_id: 10,
  },
  {
    name: "Quick Bites",
    description: "Fast and delicious snacks",
    cover_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    service_id: 10,
  },
];

async function seedMenus(prisma) {
  console.log("Seeding menus...");
  await upsertMany(prisma, prisma.menu, menus, ["name", "service_id"]);
  console.log(`Seeded ${menus.length} menus`);
}

module.exports = { seedMenus };
