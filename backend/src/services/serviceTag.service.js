const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

function toPascalCase(str) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatGroupTitle(key) {
  const map = {
    nature: "Environment",
    concept: "Concept",
    experience: "Experience",
    feature: "Feature",
    location: "Location",
    vibe: "Vibe",
    model: "Model",
  };
  return map[key] || toPascalCase(key);
}

const ServiceTagService = {
  getAll: async () => {
    return await prisma.serviceTag.findMany();
  },

  getByType: async (type) => {
    const tags = await prisma.serviceTag.findMany({
      where: {
        category: {
          startsWith: `${type}/`,
        },
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    const grouped = tags.reduce((acc, tag) => {
      const groupKey = tag.category.split("/")[1];
      const groupTitle = formatGroupTitle(groupKey);
      if (!acc[groupTitle]) acc[groupTitle] = [];
      acc[groupTitle].push({
        id: tag.id,
        name: tag.name,
        display: toPascalCase(tag.name),
      });
      return acc;
    }, {});

    return { type, grouped };
  },

  getById: async (id) => {
    const tag = await prisma.serviceTag.findUnique({
      where: { id },
    });
    if (!tag) {
      throw new AppError(
        ERROR_CODES.SERVICE_TAG_NOT_FOUND.statusCode,
        ERROR_CODES.SERVICE_TAG_NOT_FOUND.message,
        ERROR_CODES.SERVICE_TAG_NOT_FOUND.code,
      );
    }
    return tag;
  },

  create: async (data) => {
    const created = await prisma.serviceTag.create({
      data,
    });
    return created;
  },

  update: async (id, data) => {
    await ServiceTagService.getById(id);
    const updated = await prisma.serviceTag.update({
      where: { id },
      data,
    });
    return updated;
  },

  delete: async (id) => {
    await ServiceTagService.getById(id);
    await prisma.serviceTag.delete({
      where: { id },
    });
  },
};

module.exports = { ServiceTagService };
