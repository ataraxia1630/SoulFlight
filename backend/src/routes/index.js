const authRoutes = require('./auth.routes');
const serviceTypeRoutes = require('./serviceType.routes');
const serviceTagRoutes = require('./serviceTag.routes');

function route(app) {
  app.use('/api/auth', authRoutes);
  app.use('/api/service-type', serviceTypeRoutes);
  app.use('/api/service-tag', serviceTagRoutes);
}

module.exports = route;
