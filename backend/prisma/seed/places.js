const { upsertMany } = require("./utils/upsertMany");

const places = [
  {
    name: "Sam Mountain",
    description: "Sacred mountain with panoramic views of the Mekong Delta",
    address: "Sam Mountain, Chau Doc, An Giang",
    opening_hours: { open: "06:00", close: "18:00" },
    entry_fee: 50000,
  },
  {
    name: "Tra Su Cajuput Forest",
    description: "Beautiful mangrove forest and bird sanctuary",
    address: "Tinh Bien District, An Giang",
    opening_hours: { open: "06:30", close: "17:30" },
    entry_fee: 100000,
  },
  {
    name: "Cai Rang Floating Market",
    description: "Largest floating market in the Mekong Delta",
    address: "Cai Rang, Can Tho",
    opening_hours: { open: "05:00", close: "09:00" },
    entry_fee: 0,
  },
  {
    name: "Chau Doc Market",
    description: "Traditional Vietnamese market with local products",
    address: "Chi Lang Street, Chau Doc",
    opening_hours: { open: "05:00", close: "19:00" },
    entry_fee: 0,
  },
  {
    name: "Thoai Ngoc Hau Tomb",
    description: "Historical tomb of famous Vietnamese general",
    address: "Sam Mountain, Chau Doc",
    opening_hours: { open: "07:00", close: "17:00" },
    entry_fee: 20000,
  },
  {
    name: "Ba Chua Xu Temple",
    description: "Ancient temple dedicated to the Lady of the Realm",
    address: "Sam Mountain, Chau Doc",
    opening_hours: { open: "06:00", close: "18:00" },
    entry_fee: 0,
  },
  {
    name: "Mekong River",
    description: "Mighty river flowing through Southeast Asia",
    address: "Chau Doc, An Giang",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Chau Doc Floating Village",
    description: "Traditional floating houses and fish farms",
    address: "Chau Giang, Chau Doc",
    opening_hours: { open: "06:00", close: "18:00" },
    entry_fee: 30000,
  },
  {
    name: "Long Xuyen City",
    description: "Capital city of An Giang province",
    address: "Long Xuyen, An Giang",
    opening_hours: null,
    entry_fee: 0,
  },
  {
    name: "Phu Chau Traditional Village",
    description: "Village preserving traditional Khmer culture",
    address: "Chau Doc, An Giang",
    opening_hours: { open: "07:00", close: "18:00" },
    entry_fee: 40000,
  },
];

async function seedPlaces(prisma) {
  console.log("Seeding places...");
  await upsertMany(prisma, prisma.place, places, ["name", "address"]);
  console.log(`Seeded ${places.length} places`);
}

module.exports = { seedPlaces };
