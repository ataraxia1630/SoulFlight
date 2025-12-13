const prisma = require("../configs/prisma");

const attachImages = async ({ entity, type }) => {
  if (!entity) return entity;

  const images = await prisma.image.findMany({
    where: {
      related_id: entity.id,
      related_type: type,
    },
    orderBy: { position: "asc" },
  });

  return { ...entity, images };
};

const attachImagesList = async ({ entities, type }) => {
  if (!entities || entities.length === 0) return entities;

  const ids = entities.map((e) => e.id);

  const images = await prisma.image.findMany({
    where: {
      related_id: { in: ids },
      related_type: type,
    },
    orderBy: { position: "asc" },
  });

  const map = {};
  for (const img of images) {
    if (!map[img.related_id]) map[img.related_id] = [];
    map[img.related_id].push(img);
  }

  return entities.map((e) => ({
    ...e,
    images: map[e.id] || [],
  }));
};

module.exports = {
  attachImages,
  attachImagesList,
};
