const getDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) throw new Error("Thiếu ngày");

  const start = new Date(`${checkIn}T00:00:00.000Z`);
  const end = new Date(`${checkOut}T00:00:00.000Z`);

  if (Number.isNaN(start) || Number.isNaN(end)) throw new Error("Ngày không hợp lệ");
  if (end <= start) throw new Error("Check-out phải sau check-in");

  const dates = [];
  const current = new Date(start);

  while (current < end) {
    dates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
};

module.exports = { getDateRange };
