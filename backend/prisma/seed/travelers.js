const { upsertMany } = require("./utils/upsertMany");

const travelers = [
  {
    id: 5,
    gender: "MALE",
    dob: new Date("1990-05-15"),
    location: "Los Angeles, USA",
    avatar_url: "https://i.pravatar.cc/300?img=12",
  },
  {
    id: 6,
    gender: "FEMALE",
    dob: new Date("1988-08-22"),
    location: "London, UK",
    avatar_url: "https://i.pravatar.cc/300?img=47",
  },
  {
    id: 7,
    gender: "MALE",
    dob: new Date("1995-03-10"),
    location: "Sydney, Australia",
    avatar_url: "https://i.pravatar.cc/300?img=33",
  },
];

async function seedTravelers(prisma) {
  console.log("Seeding travelers...");
  await upsertMany(prisma, prisma.traveler, travelers, ["id"]);
  console.log(`Seeded ${travelers.length} travelers`);
}

module.exports = { seedTravelers };
