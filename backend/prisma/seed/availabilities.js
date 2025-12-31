// const { upsertMany } = require("./utils/upsertMany");

// Tạo availability cho phòng (room_id 1-30)
const roomAvailabilities = [];
for (let roomId = 1; roomId <= 30; roomId++) {
  for (let i = 0; i < 60; i++) {
    const date = new Date("2025-01-15");
    date.setDate(date.getDate() + i);
    roomAvailabilities.push({
      room_id: roomId,
      date: date,
      available_count: Math.floor(Math.random() * 3) + 1, // 1-3 phòng trống
      price_override: Math.random() > 0.7 ? Math.floor(Math.random() * 50000) + 50000 : null,
    });
  }
}

// Tạo availability cho ticket (ticket_id 1-10)
const ticketAvailabilities = [];
for (let ticketId = 1; ticketId <= 10; ticketId++) {
  for (let i = 0; i < 60; i++) {
    const date = new Date("2025-01-15");
    date.setDate(date.getDate() + i);
    ticketAvailabilities.push({
      ticket_id: ticketId,
      date: date,
      available_count: Math.floor(Math.random() * 20) + 10, // 10-30 vé
      max_count: 50,
      price_override: Math.random() > 0.8 ? Math.floor(Math.random() * 30000) + 30000 : null,
    });
  }
}

async function seedRoomAvailabilities(prisma) {
  console.log("Seeding room availabilities...");
  for (const item of roomAvailabilities) {
    await prisma.roomAvailability
      .upsert({
        where: {
          room_id_date: {
            room_id: item.room_id,
            date: item.date,
          },
        },
        update: item,
        create: item,
      })
      .catch((_e) => {
        // Ignore unique constraint errors - some dates might already exist
      });
  }
  console.log(`Seeded ${roomAvailabilities.length} room availabilities`);
}

async function seedTicketAvailabilities(prisma) {
  console.log("Seeding ticket availabilities...");
  for (const item of ticketAvailabilities) {
    await prisma.ticketAvailability
      .upsert({
        where: {
          ticket_id_date: {
            ticket_id: item.ticket_id,
            date: item.date,
          },
        },
        update: item,
        create: item,
      })
      .catch((_e) => {
        // Ignore unique constraint errors
      });
  }
  console.log(`Seeded ${ticketAvailabilities.length} ticket availabilities`);
}

module.exports = {
  seedRoomAvailabilities,
  seedTicketAvailabilities,
};
