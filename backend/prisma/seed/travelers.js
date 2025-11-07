const { upsertMany } = require("./utils/upsertMany");

async function seedTravelers(prisma, travelerUsers) {
  console.log("Seeding travelers...");

  const travelers = [
    {
      id: travelerUsers[0].id,
      gender: "MALE",
      dob: new Date("1990-05-15"),
      location: "Los Angeles, USA",
      avatar_url: "https://i.pravatar.cc/300?img=12",
    },
    {
      id: travelerUsers[1].id,
      gender: "FEMALE",
      dob: new Date("1988-08-22"),
      location: "London, UK",
      avatar_url: "https://i.pravatar.cc/300?img=47",
    },
    {
      id: travelerUsers[2].id,
      gender: "MALE",
      dob: new Date("1995-03-10"),
      location: "Sydney, Australia",
      avatar_url: "https://i.pravatar.cc/300?img=33",
    },
  ];

  await upsertMany(prisma, prisma.traveler, travelers, ["id"]);
  console.log(`Seeded ${travelers.length} travelers`);
}

module.exports = { seedTravelers };
