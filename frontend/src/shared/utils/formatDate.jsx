export const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getDurationText = (hours) => {
  if (hours <= 0) return "Trong ngày";
  if (hours < 24) return `${hours} giờ`;

  const days = Math.floor(hours / 24);
  const remainHours = hours % 24;

  if (remainHours > 0) {
    return `${days} ngày ${remainHours} giờ`;
  }
  return `${days} ngày`;
};
