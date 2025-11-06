const { upsertMany } = require("./utils/upsertMany");

const menuItems = [
  // Menu 1 - Traditional Pho Menu
  {
    id: 1,
    name: "Pho Bo (Beef Pho)",
    description: "Traditional beef pho with rice noodles and herbs",
    image_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43",
    price: 65000,
    unit: "BOWL",
    status: "AVAILABLE",
    menu_id: 1,
  },
  {
    id: 2,
    name: "Pho Ga (Chicken Pho)",
    description: "Light chicken pho with tender meat",
    image_url: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb",
    price: 60000,
    unit: "BOWL",
    status: "AVAILABLE",
    menu_id: 1,
  },
  {
    id: 3,
    name: "Pho Tai (Rare Beef Pho)",
    description: "Pho with thinly sliced rare beef",
    image_url: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1",
    price: 70000,
    unit: "BOWL",
    status: "AVAILABLE",
    menu_id: 1,
  },

  // Menu 2 - Side Dishes
  {
    id: 4,
    name: "Cha Gio (Spring Rolls)",
    description: "Crispy fried spring rolls with pork and vegetables",
    image_url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb",
    price: 45000,
    unit: "PORTION",
    status: "AVAILABLE",
    menu_id: 2,
  },
  {
    id: 5,
    name: "Goi Cuon (Fresh Spring Rolls)",
    description: "Fresh rice paper rolls with shrimp and herbs",
    image_url: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087",
    price: 40000,
    unit: "PORTION",
    status: "AVAILABLE",
    menu_id: 2,
  },

  // Menu 3 - Fusion Dishes
  {
    id: 6,
    name: "Pho Fusion Bowl",
    description: "Modern take on pho with international ingredients",
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
    price: 120000,
    unit: "BOWL",
    status: "AVAILABLE",
    menu_id: 3,
  },
  {
    id: 7,
    name: "Vietnamese Beef Tartare",
    description: "Raw beef with Vietnamese spices and crispy rice",
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947",
    price: 150000,
    unit: "DISH",
    status: "AVAILABLE",
    menu_id: 3,
  },
  {
    id: 8,
    name: "Banh Mi Burger",
    description: "Vietnamese baguette meets gourmet burger",
    image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
    price: 135000,
    unit: "PIECE",
    status: "AVAILABLE",
    menu_id: 3,
  },

  // Menu 4 - Premium Selection
  {
    id: 9,
    name: "Wagyu Pho",
    description: "Premium pho with wagyu beef slices",
    image_url: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841",
    price: 280000,
    unit: "BOWL",
    status: "AVAILABLE",
    menu_id: 4,
  },
  {
    id: 10,
    name: "Lobster Spring Rolls",
    description: "Fresh lobster in crispy spring rolls",
    image_url: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7",
    price: 250000,
    unit: "PORTION",
    status: "AVAILABLE",
    menu_id: 4,
  },

  // Menu 5 - Fine Dining Menu
  {
    id: 11,
    name: "Seven Course Tasting Menu",
    description: "Chef's selection of finest Vietnamese dishes",
    image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    price: 850000,
    unit: "SET",
    status: "AVAILABLE",
    menu_id: 5,
  },
  {
    id: 12,
    name: "Premium Seafood Platter",
    description: "Fresh seafood prepared Vietnamese style",
    image_url: "https://images.unsplash.com/photo-1559737558-2f5a932e5f61",
    price: 680000,
    unit: "DISH",
    status: "AVAILABLE",
    menu_id: 5,
  },

  // Menu 6 - Wine & Cocktails
  {
    id: 13,
    name: "Saigon Sunset Cocktail",
    description: "Signature cocktail with local fruits",
    image_url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
    price: 180000,
    unit: "GLASS",
    status: "AVAILABLE",
    menu_id: 6,
  },
  {
    id: 14,
    name: "French Red Wine Selection",
    description: "Curated selection of French red wines",
    image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
    price: 450000,
    unit: "BOTTLE",
    status: "AVAILABLE",
    menu_id: 6,
  },

  // Menu 7 - Coffee Selection
  {
    id: 15,
    name: "Ca Phe Sua Da",
    description: "Vietnamese iced coffee with condensed milk",
    image_url: "https://images.unsplash.com/photo-1611162458324-aae1eb4129a2",
    price: 35000,
    unit: "GLASS",
    status: "AVAILABLE",
    menu_id: 7,
  },
  {
    id: 16,
    name: "Egg Coffee",
    description: "Traditional Hanoi style egg coffee",
    image_url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699",
    price: 45000,
    unit: "CUP",
    status: "AVAILABLE",
    menu_id: 7,
  },

  // Menu 8 - Pastries & Desserts
  {
    id: 17,
    name: "Banh Flan",
    description: "Vietnamese creme caramel",
    image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777",
    price: 25000,
    unit: "PIECE",
    status: "AVAILABLE",
    menu_id: 8,
  },
  {
    id: 18,
    name: "Croissant",
    description: "Buttery French croissant",
    image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a",
    price: 30000,
    unit: "PIECE",
    status: "AVAILABLE",
    menu_id: 8,
  },

  // Menu 9 - Street Food Classics
  {
    id: 19,
    name: "Banh Mi Thit",
    description: "Vietnamese sandwich with pork and pate",
    image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    price: 30000,
    unit: "PIECE",
    status: "AVAILABLE",
    menu_id: 9,
  },
  {
    id: 20,
    name: "Bun Cha",
    description: "Grilled pork with rice noodles",
    image_url: "https://images.unsplash.com/photo-1559314809-0d155014e29e",
    price: 55000,
    unit: "BOWL",
    status: "AVAILABLE",
    menu_id: 9,
  },
];

async function seedMenuItems(prisma) {
  console.log("Seeding menu items...");
  await upsertMany(prisma, prisma.menuItem, menuItems, ["id"]);
  console.log(`Seeded ${menuItems.length} menu items`);
}

module.exports = { seedMenuItems };
