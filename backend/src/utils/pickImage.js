const { getMainImage } = require("./imageGetMain");

async function pickImage(service) {
  if (!service) {
    return null;
  }

  if (service.Rooms?.length) {
    const roomId = service.Rooms[0].id;
    const roomImg = await getMainImage(roomId, "Room");
    if (roomImg) return roomImg;
  }

  const placeId = service.Tours?.[0]?.TourPlace?.[0]?.place_id;
  if (placeId) {
    const placeImg = await getMainImage(placeId, "Place");
    if (placeImg) return placeImg;
  }

  if (service.Menus?.[0]?.cover_url) return service.Menus[0].cover_url;

  const menuItem = service.Menus?.[0]?.MenuItems?.[0];
  if (menuItem?.image_url) return menuItem.image_url;

  const ticketPlaceId = service.Tickets?.[0]?.place_id;
  if (ticketPlaceId) {
    const ticketPlaceImg = await getMainImage(ticketPlaceId, "Place");
    if (ticketPlaceImg) return ticketPlaceImg;
  }

  return null;
}

module.exports = { pickImage };
