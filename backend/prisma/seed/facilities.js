const { upsertMany } = require("./utils/upsertMany");

const facilities = [
  {
    name: "Air Conditioning",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2907/2907762.png",
  },
  {
    name: "Free WiFi",
    icon_url: "https://cdn-icons-png.flaticon.com/512/93/93158.png",
  },
  {
    name: "TV",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2956/2956769.png",
  },
  {
    name: "Mini Bar",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3050/3050155.png",
  },
  {
    name: "Safe Box",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2913/2913133.png",
  },
  {
    name: "Balcony",
    icon_url: "https://cdn-icons-png.flaticon.com/512/5397/5397715.png",
  },
  {
    name: "Private Bathroom",
    icon_url: "https://cdn-icons-png.flaticon.com/512/1021/1021203.png",
  },
  {
    name: "Bathtub",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2917/2917995.png",
  },
  {
    name: "Hair Dryer",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2553/2553645.png",
  },
  {
    name: "Coffee Maker",
    icon_url: "https://cdn-icons-png.flaticon.com/512/924/924514.png",
  },
  {
    name: "Work Desk",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
  },
  {
    name: "Wardrobe",
    icon_url: "https://cdn-icons-png.flaticon.com/512/1198/1198378.png",
  },
  {
    name: "Slippers",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2913/2913163.png",
  },
  {
    name: "Iron",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2917/2917242.png",
  },
  {
    name: "Pool Access",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2913/2913112.png",
  },
  {
    name: "Kitchenette",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3050/3050087.png",
  },
  {
    name: "Soundproof",
    icon_url: "https://cdn-icons-png.flaticon.com/512/1632/1632670.png",
  },
];

async function seedFacilities(prisma) {
  console.log("Seeding facilities...");
  await upsertMany(prisma, prisma.facility, facilities, ["name", "icon_url"]);
  console.log(`Seeded ${facilities.length} facilities`);
}

module.exports = { seedFacilities };
