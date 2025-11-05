const { upsertMany } = require("./utils/upsertMany");

const facilities = [
  {
    id: 1,
    name: "Air Conditioning",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2907/2907762.png",
  },
  {
    id: 2,
    name: "Free WiFi",
    icon_url: "https://cdn-icons-png.flaticon.com/512/93/93158.png",
  },
  {
    id: 3,
    name: "TV",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2956/2956769.png",
  },
  {
    id: 4,
    name: "Mini Bar",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3050/3050155.png",
  },
  {
    id: 5,
    name: "Safe Box",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2913/2913133.png",
  },
  {
    id: 6,
    name: "Balcony",
    icon_url: "https://cdn-icons-png.flaticon.com/512/5397/5397715.png",
  },
  {
    id: 7,
    name: "Private Bathroom",
    icon_url: "https://cdn-icons-png.flaticon.com/512/1021/1021203.png",
  },
  {
    id: 8,
    name: "Bathtub",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2917/2917995.png",
  },
  {
    id: 9,
    name: "Hair Dryer",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2553/2553645.png",
  },
  {
    id: 10,
    name: "Coffee Maker",
    icon_url: "https://cdn-icons-png.flaticon.com/512/924/924514.png",
  },
  {
    id: 11,
    name: "Work Desk",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
  },
  {
    id: 12,
    name: "Wardrobe",
    icon_url: "https://cdn-icons-png.flaticon.com/512/1198/1198378.png",
  },
  {
    id: 13,
    name: "Slippers",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2913/2913163.png",
  },
  {
    id: 14,
    name: "Iron",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2917/2917242.png",
  },
  {
    id: 15,
    name: "Pool Access",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2913/2913112.png",
  },
  {
    id: 16,
    name: "Kitchenette",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3050/3050087.png",
  },
  {
    id: 17,
    name: "Soundproof",
    icon_url: "https://cdn-icons-png.flaticon.com/512/1632/1632670.png",
  },
];

async function seedFacilities(prisma) {
  console.log("Seeding facilities...");
  await upsertMany(prisma, prisma.facility, facilities, ["id"]);
  console.log(`Seeded ${facilities.length} facilities`);
}

module.exports = { seedFacilities };
