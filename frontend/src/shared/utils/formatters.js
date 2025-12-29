export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const calculateNights = (checkinDate, checkoutDate) => {
  const checkin = new Date(checkinDate);
  const checkout = new Date(checkoutDate);
  return Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
};
