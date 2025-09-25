const authRoutes = require('./auth.routes');

function route(app) {
  app.use('/api/auth', authRoutes);
}

module.exports = route;
