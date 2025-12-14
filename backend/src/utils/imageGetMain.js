const prisma = require("../configs/prisma");

async function getMainImage(relatedId, relatedType) {
  const img = await prisma.image.findFirst({
    where: {
      related_id: relatedId,
      related_type: relatedType,
    },
    orderBy: [{ is_main: "desc" }, { position: "asc" }, { created_at: "asc" }],
  });

  return img?.url || null;
}

module.exports = { getMainImage };
