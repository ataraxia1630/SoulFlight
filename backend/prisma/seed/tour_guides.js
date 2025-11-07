const { upsertMany } = require("./utils/upsertMany");

const tourGuides = [
  {
    name: "Nguyen Van An",
    phone: "+84978123456",
    description:
      "Experienced guide with 10 years in Mekong Delta tourism. Fluent in English, French, and Vietnamese.",
    image_url: "https://i.pravatar.cc/400?img=15",
  },
  {
    name: "Tran Thi Binh",
    phone: "+84989234567",
    description:
      "Local expert specializing in cultural tours and traditional villages. Speaks English and Japanese.",
    image_url: "https://i.pravatar.cc/400?img=45",
  },
  {
    name: "Le Minh Chau",
    phone: "+84967345678",
    description:
      "Adventure tour specialist with expertise in cycling and eco-tourism. English and German speaker.",
    image_url: "https://i.pravatar.cc/400?img=52",
  },
  {
    name: "Pham Thanh Dat",
    phone: "+84956456789",
    description: "Photographer and nature guide focusing on bird watching and wildlife tours.",
    image_url: "https://i.pravatar.cc/400?img=13",
  },
  {
    name: "Hoang Thi Em",
    phone: "+84945567890",
    description: "Food tour expert with deep knowledge of local cuisine and cooking traditions.",
    image_url: "https://i.pravatar.cc/400?img=48",
  },
];

async function seedTourGuides(prisma) {
  console.log("Seeding tour guides...");
  await upsertMany(prisma, prisma.tourGuide, tourGuides, ["name", "phone"]);
  console.log(`Seeded ${tourGuides.length} tour guides`);
}

module.exports = { seedTourGuides };
