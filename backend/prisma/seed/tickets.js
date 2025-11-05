const { upsertMany } = require("./utils/upsertMany");

const tickets = [
  // Sam Mountain Experience (service_id: 14)
  {
    id: 1,
    service_id: 14,
    name: "Sam Mountain Cable Car - Adult",
    description: "Round trip cable car ticket for adults",
    price: 150000,
    place_id: 1,
  },
  {
    id: 2,
    service_id: 14,
    name: "Sam Mountain Cable Car - Child",
    description: "Round trip cable car ticket for children (under 12)",
    price: 80000,
    place_id: 1,
  },
  {
    id: 3,
    service_id: 14,
    name: "Sam Mountain Temple Tour",
    description: "Guided temple tour with cultural insights",
    price: 120000,
    place_id: 6,
  },
  {
    id: 4,
    service_id: 14,
    name: "Historical Sites Combo",
    description: "Access to Thoai Ngoc Hau Tomb and museum",
    price: 80000,
    place_id: 5,
  },

  // Tra Su Cajuput Forest (service_id: 15)
  {
    id: 5,
    service_id: 15,
    name: "Tra Su Forest Entry - Adult",
    description: "Entry ticket with boat ride for adults",
    price: 150000,
    place_id: 2,
  },
  {
    id: 6,
    service_id: 15,
    name: "Tra Su Forest Entry - Child",
    description: "Entry ticket with boat ride for children",
    price: 80000,
    place_id: 2,
  },
  {
    id: 7,
    service_id: 15,
    name: "Bird Watching Tour",
    description: "Guided bird watching tour with binoculars",
    price: 200000,
    place_id: 2,
  },
  {
    id: 8,
    service_id: 15,
    name: "Photography Package",
    description: "Extended boat tour for photography enthusiasts",
    price: 250000,
    place_id: 2,
  },
  {
    id: 9,
    service_id: 15,
    name: "Sunrise Special Tour",
    description: "Early morning tour to catch the sunrise",
    price: 180000,
    place_id: 2,
  },
  {
    id: 10,
    service_id: 15,
    name: "Eco Tour with Lunch",
    description: "Full experience including local lunch",
    price: 300000,
    place_id: 2,
  },
];

async function seedTickets(prisma) {
  console.log("Seeding tickets...");
  await upsertMany(prisma, prisma.ticket, tickets, ["id"]);
  console.log(`Seeded ${tickets.length} tickets`);
}

module.exports = { seedTickets };
