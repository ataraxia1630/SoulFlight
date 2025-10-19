const prisma = require("../configs/prisma");

const FacilityService = {
  create: (data) => prisma.facility.create({ data }),

  getAll: () => prisma.facility.findMany(),

  getOne: (id) =>
    prisma.facility.findUnique({ where: { id: parseInt(id, 10) } }),

  update: (id, data) =>
    prisma.facility.update({ where: { id: parseInt(id, 10) }, data }),

  remove: (id) => prisma.facility.delete({ where: { id: parseInt(id, 10) } }),
};

module.exports = FacilityService;
