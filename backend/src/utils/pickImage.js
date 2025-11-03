/**
 * Hàm chọn ảnh
 * 1. Ảnh chính của phòng (Room)
 * 2. Ảnh đầu tiên của phòng
 * 3. Ảnh địa điểm của Tour -> Place
 * 4. Ảnh món ăn trong Menu
 * 5. Ảnh cover của Menu
 * 6. Ảnh địa điểm của Ticket -> Place
 */
function pickImage(service) {
  if (!service) return null;

  const candidates = [
    () => service.Rooms?.[0]?.images?.find((img) => img.is_main)?.url,
    () => service.Rooms?.[0]?.images?.[0]?.url,
    () => service.Tour?.[0]?.TourPlace?.[0]?.Place?.image_url,
    () => service.Menus?.[0]?.MenuItems?.[0]?.image_url,
    () => service.Menus?.[0]?.cover_url,
    () => service.Tickets?.[0]?.Place?.image_url,
  ];

  for (const getUrl of candidates) {
    const url = getUrl();
    if (url) return url;
  }

  return null;
}

module.exports = { pickImage };
