const getDateRange = (checkin, checkout) => {
  const start = new Date(checkin);
  const end = new Date(checkout);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (end <= start) throw new Error("checkout phải sau checkin");

  const dates = [];
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
};

module.exports = { getDateRange };
