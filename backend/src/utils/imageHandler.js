const prisma = require("../configs/prisma");
const CloudinaryService = require("../services/cloudinary.service");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const MAX_IMAGES = 10;

const uploadImages = async (entityId, files, entityType, folder = "common") => {
  const currentCount = await prisma.image.count({
    where: { related_id: entityId, related_type: entityType },
  });

  const remainingSlots = MAX_IMAGES - currentCount;
  if (remainingSlots <= 0 || files.length > remainingSlots) {
    throw new AppError(
      ERROR_CODES.TOO_MANY_IMAGES.statusCode,
      `Maximum ${MAX_IMAGES} images allowed for ${entityType}`,
      ERROR_CODES.TOO_MANY_IMAGES.code,
    );
  }

  const filesToUpload = files.slice(0, remainingSlots);
  const isFirstImage = currentCount === 0;

  const uploadResults = await Promise.all(
    filesToUpload.map((file) => CloudinaryService.uploadSingle(file.buffer, { folder })),
  );

  const imageData = uploadResults.map((result, i) => ({
    url: result.public_id,
    position: currentCount + i,
    is_main: isFirstImage && i === 0,
    related_id: entityId,
    related_type: entityType,
  }));

  await prisma.image.createMany({
    data: imageData,
    skipDuplicates: true,
  });

  return uploadResults;
};

const updateImageList = async (tx, entityId, entityType, updates) => {
  const toDelete = updates.filter((u) => u.delete && u.id);
  if (toDelete.length > 0) {
    const ids = toDelete.map((u) => u.id);
    const images = await tx.image.findMany({
      where: {
        id: { in: ids },
        related_id: entityId,
        related_type: entityType,
      },
      select: { url: true },
    });
    if (images.length > 0) {
      try {
        await CloudinaryService.deleteMultiple(images.map((i) => i.url));
      } catch {
        console.warn(`Image not in cloudinary`);
      }
    }
    await tx.image.deleteMany({ where: { id: { in: ids } } });
  }

  const toUpdate = updates.filter((u) => u.id && !u.delete);
  if (toUpdate.length > 0) {
    for (const u of toUpdate) {
      await tx.image.update({
        where: { id: u.id },
        data: {
          position: u.position ?? undefined,
          is_main: u.is_main ?? undefined,
        },
      });
    }
  }

  // Đảm bảo luôn có 1 ảnh main
  const hasMain = updates.some((u) => u.is_main === true);
  if (!hasMain) {
    const firstImage = await tx.image.findFirst({
      where: { related_id: entityId, related_type: entityType },
      orderBy: { position: "asc" },
      select: { id: true },
    });
    if (firstImage) {
      await tx.image.updateMany({
        where: { related_id: entityId, related_type: entityType },
        data: { is_main: false },
      });
      await tx.image.update({
        where: { id: firstImage.id },
        data: { is_main: true },
      });
    }
  }
};

module.exports = {
  uploadImages,
  updateImageList,
};
