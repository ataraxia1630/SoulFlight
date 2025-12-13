const generateAvailable = async (roomId, totalRooms, pricePerNight, tx) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setFullYear(end.getFullYear() + 2);

  const availabilityData = [];
  const date = new Date(start);

  while (date <= end) {
    availabilityData.push({
      room_id: roomId,
      date: new Date(date),
      available_count: totalRooms,
      price_override: pricePerNight,
    });
    date.setDate(date.getDate() + 1);
  }

  const chunkSize = 300;
  for (let i = 0; i < availabilityData.length; i += chunkSize) {
    await tx.roomAvailability.createMany({
      data: availabilityData.slice(i, i + chunkSize),
    });
  }
};

module.exports = { generateAvailable };
