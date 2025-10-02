const AppError = require('../utils/AppError');
const errorHandler = require('../middlewares/errorHandler.middleware');
const authRoutes = require('./auth.routes');
const serviceTypeRoutes = require('./serviceType.routes');
const serviceTagRoutes = require('./serviceTag.routes');
const menuRoutes = require('./menu.routes');

function route(app) {
  app.use('/api/auth', authRoutes);
  app.use('/api/service-type', serviceTypeRoutes);
  app.use('/api/service-tag', serviceTagRoutes);
  app.use('/api/menu', menuRoutes);

  // luôn để sau cùng

  app.use(errorHandler);
}

module.exports = route;
