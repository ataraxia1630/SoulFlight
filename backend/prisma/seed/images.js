const { upsertMany } = require("./utils/upsertMany");

const images = [
  // Room 1 - Deluxe City View
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
    position: 0,
    is_main: true,
    related_id: 1,
    related_type: "Room",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14",
    position: 1,
    is_main: false,
    related_id: 1,
    related_type: "Room",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
    position: 2,
    is_main: false,
    related_id: 1,
    related_type: "Room",
  },

  // Room 2 - Executive Suite
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    position: 0,
    is_main: true,
    related_id: 2,
    related_type: "Room",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
    position: 1,
    is_main: false,
    related_id: 2,
    related_type: "Room",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
    position: 2,
    is_main: false,
    related_id: 2,
    related_type: "Room",
  },

  // Room 3 - Presidential Suite
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
    position: 0,
    is_main: true,
    related_id: 3,
    related_type: "Room",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
    position: 1,
    is_main: false,
    related_id: 3,
    related_type: "Room",
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1571624436279-b272aff752b5",
    position: 2,
    is_main: false,
    related_id: 3,
    related_type: "Room",
  },

  // Room 5 - Ocean View Bungalow
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    position: 0,
    is_main: true,
    related_id: 5,
    related_type: "Room",
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    position: 1,
    is_main: false,
    related_id: 5,
    related_type: "Room",
  },

  // Room 6 - Beach Villa
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1",
    position: 0,
    is_main: true,
    related_id: 6,
    related_type: "Room",
  },
  {
    id: 13,
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    position: 1,
    is_main: false,
    related_id: 6,
    related_type: "Room",
  },
  {
    id: 14,
    url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
    position: 2,
    is_main: false,
    related_id: 6,
    related_type: "Room",
  },

  // Room 9 - Heritage Room
  {
    id: 15,
    url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    position: 0,
    is_main: true,
    related_id: 9,
    related_type: "Room",
  },
  {
    id: 16,
    url: "https://images.unsplash.com/photo-1540518614846-7eded433c457",
    position: 1,
    is_main: false,
    related_id: 9,
    related_type: "Room",
  },

  // Room 12 - Rooftop Loft
  {
    id: 17,
    url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
    position: 0,
    is_main: true,
    related_id: 12,
    related_type: "Room",
  },
  {
    id: 18,
    url: "https://images.unsplash.com/photo-1449844908441-8829872d2607",
    position: 1,
    is_main: false,
    related_id: 12,
    related_type: "Room",
  },

  // Room 15 - Luxury Mountain Suite
  {
    id: 19,
    url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
    position: 0,
    is_main: true,
    related_id: 15,
    related_type: "Room",
  },
  {
    id: 20,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    position: 1,
    is_main: false,
    related_id: 15,
    related_type: "Room",
  },
];

async function seedImages(prisma) {
  console.log("Seeding images...");
  await upsertMany(prisma, prisma.image, images, ["id"]);
  console.log(`Seeded ${images.length} images`);
}

module.exports = { seedImages };
