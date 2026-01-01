const generateTicketAvailable = async (
  ticketId,
  maxCountInput,
  price,
  tx,
  customStartDate = null,
) => {
  // dùng ngày hiện tại cho lần tạo đầu tiên và lần sau bắt đầu từ ngày cuối của lần trước
  const start = customStartDate ? new Date(customStartDate) : new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);

  const availabilityData = [];
  const date = new Date(start);

  const maxCount = maxCountInput ? parseInt(maxCountInput, 10) : null;
  const initialAvailable = maxCount !== null ? maxCount : 1000000000;

  while (date <= end) {
    availabilityData.push({
      ticket_id: ticketId,
      date: new Date(date),
      available_count: initialAvailable,
      max_count: maxCount,
      price_override: parseFloat(price),
    });

    date.setDate(date.getDate() + 1);
  }

  // Chia nhỏ dữ liệu (batching):
  // 1. Tránh vượt giới hạn tham số (Parameter Limit) của Database (Postgres).
  // 2. Tiết kiệm RAM server và tránh lỗi Out of Memory.
  // 3. Ngăn chặn Timeout khi insert dữ liệu quá lớn cùng lúc.
  const chunkSize = 300;
  for (let i = 0; i < availabilityData.length; i += chunkSize) {
    await tx.ticketAvailability.createMany({
      data: availabilityData.slice(i, i + chunkSize),
      skipDuplicates: true, // chặn lỗi tạo trùng ngày
    });
  }
};

module.exports = { generateTicketAvailable };
