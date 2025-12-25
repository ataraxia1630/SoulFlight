const errorHandler = require("../middlewares/errorHandler.middleware");
const authRoutes = require("./auth.routes");
const serviceTypeRoutes = require("./serviceType.routes");
const serviceTagRoutes = require("./serviceTag.routes");
const menuRoutes = require("./menu.routes");
const menuItemRoutes = require("./menuItem.routes");
const serviceRoutes = require("./service.routes");
const cloudinaryRoutes = require("./cloudinary.routes");
const placeRoutes = require("./place.routes");
const tourRoutes = require("./tour.routes");
const facilityRoutes = require("./facility.routes");
const roomRoutes = require("./room.routes");
const ticketRoutes = require("./ticket.routes");
const searchRoutes = require("./search.route");
const travelerRoutes = require("./traveler.routes");
const providerRoutes = require("./provider.routes");
const cartRoutes = require("./cart.routes");
const bookingRoutes = require("./booking.routes");
const itineraryRoutes = require("./itinerary.routes");
const notificationRoutes = require("./notification.routes");
const reportRoutes = require("./report.routes");
const wishlistRoutes = require("./wishlist.routes");
const reviewRoutes = require("./review.routes");

function route(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/service-type", serviceTypeRoutes);
  app.use("/api/service-tag", serviceTagRoutes);
  app.use("/api/menu", menuRoutes);
  app.use("/api/menu-item", menuItemRoutes);
  app.use("/api/service", serviceRoutes);
  app.use("/api/cloudinary", cloudinaryRoutes);
  app.use("/api/place", placeRoutes);
  app.use("/api/tour", tourRoutes);
  app.use("/api/facility", facilityRoutes);
  app.use("/api/room", roomRoutes);
  app.use("/api/ticket", ticketRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/traveler", travelerRoutes);
  app.use("/api/provider", providerRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/booking", bookingRoutes);
  app.use("/api/itinerary", itineraryRoutes);
  app.use("/api/notification", notificationRoutes);
  app.use("/api/report", reportRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/review", reviewRoutes);

  // luôn để sau cùng

  app.use(errorHandler);
}

module.exports = route;
