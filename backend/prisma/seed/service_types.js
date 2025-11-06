const { upsertMany } = require("./utils/upsertMany");

const serviceTypes = [
  {
    id: 1,
    name: "stay",
    description: "Hotels, resorts, homestays, and other lodging services",
  },
  {
    id: 2,
    name: "fnb",
    description: "Restaurants, cafes, bars, and dining experiences",
  },
  {
    id: 3,
    name: "tour",
    description: "Guided tours, excursions, and adventure activities",
  },
  {
    id: 4,
    name: "transport",
    description: "Theme parks, museums, historical sites, and tourist spots",
  },
  {
    id: 5,
    name: "leisure",
  },
];

async function seedServiceTypes(prisma) {
  console.log("Seeding service types...");
  await upsertMany(prisma, prisma.serviceType, serviceTypes, ["id"]);
  console.log(`Seeded ${serviceTypes.length} service types`);
}

module.exports = { seedServiceTypes };
