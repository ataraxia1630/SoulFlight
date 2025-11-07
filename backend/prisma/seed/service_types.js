const { upsertMany } = require("./utils/upsertMany");

const serviceTypes = [
  {
    name: "stay",
    description: "Hotels, resorts, homestays, and other lodging services",
  },
  {
    name: "fnb",
    description: "Restaurants, cafes, bars, and dining experiences",
  },
  {
    name: "tour",
    description: "Guided tours, excursions, and adventure activities",
  },
  {
    name: "transport",
    description: "Theme parks, museums, historical sites, and tourist spots",
  },
  {
    name: "leisure",
  },
];

async function seedServiceTypes(prisma) {
  console.log("Seeding service types...");
  await upsertMany(prisma, prisma.serviceType, serviceTypes, ["name"]);
  console.log(`Seeded ${serviceTypes.length} service types`);
}

module.exports = { seedServiceTypes };
