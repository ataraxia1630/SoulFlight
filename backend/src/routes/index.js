const AppError = require('../utils/AppError');
const errorHandler = require('../middlewares/errorHandler');
const authRoutes = require('./auth.routes');
const serviceTypeRoutes = require('./serviceType.routes');
const serviceTagRoutes = require('./serviceTag.routes');

function route(app) {
  app.use('/api/auth', authRoutes);
  app.use('/api/service-type', serviceTypeRoutes);
  app.use('/api/service-tag', serviceTagRoutes);

  // luôn để sau cùng
  app.all('*', (req, res, next) => {
    next(new AppError(404, `Route ${req.originalUrl} not found`));
  });
  app.use(errorHandler);
}

module.exports = route;
