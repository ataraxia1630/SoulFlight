const { upsertMany } = require("./utils/upsertMany");

const places = [
  {
    name: "Sam Mountain",
    description: "Sacred mountain with panoramic views of the Mekong Delta",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    address: "Sam Mountain, Chau Doc, An Giang",
    opening_hours: { open: "06:00", close: "18:00" },
    entry_fee: 50000,
  },
  {
    name: "Tra Su Cajuput Forest",
    description: "Beautiful mangrove forest and bird sanctuary",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    address: "Tinh Bien District, An Giang",
    opening_hours: { open: "06:30", close: "17:30" },
    entry_fee: 100000,
  },
  {
    name: "Cai Rang Floating Market",
    description: "Largest floating market in the Mekong Delta",
    image_url: "https://images.unsplash.com/photo-1528127269322-539801943592",
    address: "Cai Rang, Can Tho",
    opening_hours: { open: "05:00", close: "09:00" },
    entry_fee: 0,
  },
  {
    name: "Chau Doc Market",
    description: "Traditional Vietnamese market with local products",
    image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    address: "Chi Lang Street, Chau Doc",
    opening_hours: { open: "05:00", close: "19:00" },
    entry_fee: 0,
  },
  {
    name: "Thoai Ngoc Hau Tomb",
    description: "Historical tomb of famous Vietnamese general",
    image_url: "https://images.unsplash.com/photo-1548013146-72479768bada",
    address: "Sam Mountain, Chau Doc",
    opening_hours: { open: "07:00", close: "17:00" },
    entry_fee: 20000,
  },
  {
    name: "Ba Chua Xu Temple",
    description: "Ancient temple dedicated to the Lady of the Realm",
    image_url: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092",
    address: "Sam Mountain, Chau Doc",
    opening_hours: { open: "06:00", close: "18:00" },
    entry_fee: 0,
  },
  {
    name: "Mekong River",
    description: "Mighty river flowing through Southeast Asia",
    image_url: "https://images.unsplash.com/photo-1551244072-5d12893278ab",
    address: "Chau Doc, An Giang",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Chau Doc Floating Village",
    description: "Traditional floating houses and fish farms",
    image_url: "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e",
    address: "Chau Giang, Chau Doc",
    opening_hours: { open: "06:00", close: "18:00" },
    entry_fee: 30000,
  },
  {
    name: "Long Xuyen City",
    description: "Capital city of An Giang province",
    image_url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b",
    address: "Long Xuyen, An Giang",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Phu Chau Traditional Village",
    description: "Village preserving traditional Khmer culture",
    image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    address: "Chau Doc, An Giang",
    opening_hours: { open: "07:00", close: "18:00" },
    entry_fee: 40000,
  },
  {
    name: "Hội An Ancient Town",
    description:
      "Quaint riverside town, UNESCO heritage site with traditional houses and lantern-lit evenings",
    image_url: "https://unsplash.com/photos/from-hoi-an-with-love-VW3-YSJmLLE",
    address: "Hội An, Quảng Nam",
    opening_hours: { open: "08:00", close: "22:00" },
    entry_fee: 0,
  },
  {
    name: "Vịnh Hạ Long",
    description:
      "Iconic bay with thousands of limestone islands rising from turquoise water, natural wonder",
    image_url: "https://unsplash.com/photos/-HtfdIHSbsE",
    address: "Hạ Long, Quảng Ninh",
    opening_hours: null,
    entry_fee: 250000,
  },
  {
    name: "Phong Nha-Kẻ Bàng National Park",
    description: "Massive karst cave system and jungle wilderness, ideal for adventurous tours",
    image_url: "https://images.unsplash.com/photo-1528127269322-539801943592",
    address: "Quảng Bình",
    opening_hours: { open: "06:30", close: "18:00" },
    entry_fee: 300000,
  },
  {
    name: "Đà Lạt City (Mountain Retreat)",
    description: "Highland city known for pine forests, cool climate, lakes and nature escapes",
    image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    address: "Lâm Đồng",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Ninh Bình – Tràng An Scenic Landscape",
    description: "River tour through caves & limestone formations, “Ha Long on land” experience",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    address: "Ninh Bình",
    opening_hours: { open: "07:00", close: "17:00" },
    entry_fee: 200000,
  },
];

async function seedPlaces(prisma) {
  console.log("Seeding places...");
  await upsertMany(prisma, prisma.place, places, ["name", "address"]);
  console.log(`Seeded ${places.length} places`);
}

module.exports = { seedPlaces };
