// Tạo availability cho phòng (room_id 1-25) - 1 năm từ hôm nay
const generateRoomAvailabilities = () => {
  const availabilities = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  for (let roomId = 1; roomId <= 25; roomId++) {
    const date = new Date(startDate);

    while (date <= endDate) {
      availabilities.push({
        room_id: roomId,
        date: new Date(date),
        available_count: Math.floor(Math.random() * 3) + 1, // 1-3 phòng trống
        price_override: null,
      });

      date.setDate(date.getDate() + 1);
    }
  }

  return availabilities;
};

// Tạo availability cho ticket (ticket_id 1-16) - 1 năm từ hôm nay
const generateTicketAvailabilities = () => {
  const availabilities = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  for (let ticketId = 1; ticketId <= 16; ticketId++) {
    const date = new Date(startDate);

    while (date <= endDate) {
      availabilities.push({
        ticket_id: ticketId,
        date: new Date(date),
        available_count: 50,
        max_count: 50,
        price_override: null,
      });

      date.setDate(date.getDate() + 1);
    }
  }

  return availabilities;
};

async function seedRoomAvailabilities(prisma) {
  console.log("Seeding room availabilities...");

  const roomAvailabilities = generateRoomAvailabilities();

  const chunkSize = 300;
  for (let i = 0; i < roomAvailabilities.length; i += chunkSize) {
    await prisma.roomAvailability.createMany({
      data: roomAvailabilities.slice(i, i + chunkSize),
      skipDuplicates: true,
    });
  }

  console.log(`Seeded ${roomAvailabilities.length} room availabilities (1 năm)`);
}

async function seedTicketAvailabilities(prisma) {
  console.log("Seeding ticket availabilities...");

  const ticketAvailabilities = generateTicketAvailabilities();

  const chunkSize = 300;
  for (let i = 0; i < ticketAvailabilities.length; i += chunkSize) {
    await prisma.ticketAvailability.createMany({
      data: ticketAvailabilities.slice(i, i + chunkSize),
      skipDuplicates: true,
    });
  }

  console.log(`Seeded ${ticketAvailabilities.length} ticket availabilities (1 năm)`);
}

module.exports = {
  seedRoomAvailabilities,
  seedTicketAvailabilities,
};
