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

  // luôn để sau cùng

  app.use(errorHandler);
}

module.exports = route;
