const prisma = require("../configs/prisma");
const { uploadImages, updateImageList } = require("../utils/imageHandler");
const { attachImages, attachImagesList } = require("../utils/attachImage");
const CloudinaryService = require("../services/cloudinary.service");
const { JournalDTO } = require("../dtos/journal.dto");
const { ERROR_CODES } = require("../constants/errorCode");
const AppError = require("../utils/AppError");

const ENTITY_TYPE = "TravelJournal";

const JournalService = {
  getMyJournals: async (travelerId) => {
    const journals = await prisma.travelJournal.findMany({
      where: { traveler_id: travelerId },
      orderBy: { created_at: "desc" },
    });

    const journalsWithImages = await attachImagesList({
      entities: journals,
      type: ENTITY_TYPE,
    });

    return JournalDTO.fromList(journalsWithImages);
  },

  getById: async (id, travelerId) => {
    const journal = await prisma.travelJournal.findUnique({
      where: { id: Number(id) },
    });

    if (!journal)
      throw new AppError(
        ERROR_CODES.JOURNAL_NOT_FOUND.statusCode,
        ERROR_CODES.JOURNAL_NOT_FOUND.message,
        ERROR_CODES.JOURNAL_NOT_FOUND.code,
      );
    if (journal.traveler_id !== travelerId)
      throw new AppError(
        ERROR_CODES.UNAUTHORIZED.statusCode,
        ERROR_CODES.UNAUTHORIZED.message,
        ERROR_CODES.UNAUTHORIZED.code,
      );

    const journalWithImages = await attachImages({ entity: journal, type: ENTITY_TYPE });
    return JournalDTO.fromModel(journalWithImages);
  },

  create: async (data, files, travelerId) => {
    const journal = await prisma.travelJournal.create({
      data: {
        title: data.title,
        content: data.content,
        traveler_id: travelerId,
      },
    });

    if (files && files.length > 0) {
      await uploadImages(journal.id, files, ENTITY_TYPE, "journals");
    }

    const result = await attachImages({ entity: journal, type: ENTITY_TYPE });
    return JournalDTO.fromModel(result);
  },

  update: async (id, data, files, travelerId) => {
    const journalId = Number(id);
    const existing = await prisma.travelJournal.findUnique({ where: { id: journalId } });

    if (!existing)
      throw new AppError(
        ERROR_CODES.JOURNAL_NOT_FOUND.statusCode,
        ERROR_CODES.JOURNAL_NOT_FOUND.message,
        ERROR_CODES.JOURNAL_NOT_FOUND.code,
      );
    if (existing.traveler_id !== travelerId)
      throw new AppError(
        ERROR_CODES.UNAUTHORIZED.statusCode,
        ERROR_CODES.UNAUTHORIZED.message,
        ERROR_CODES.UNAUTHORIZED.code,
      );

    await prisma.$transaction(async (tx) => {
      await tx.travelJournal.update({
        where: { id: journalId },
        data: {
          title: data.title,
          content: data.content,
        },
      });

      if (data.imageUpdates) {
        const updates =
          typeof data.imageUpdates === "string" ? JSON.parse(data.imageUpdates) : data.imageUpdates;

        await updateImageList(tx, journalId, ENTITY_TYPE, updates);
      }
    });

    if (files && files.length > 0) {
      await uploadImages(journalId, files, ENTITY_TYPE, "journals");
    }

    const updated = await JournalService.getById(journalId, travelerId);
    return updated;
  },

  delete: async (id, travelerId) => {
    const journalId = Number(id);

    const existing = await prisma.travelJournal.findUnique({ where: { id: journalId } });

    if (!existing)
      throw new AppError(
        ERROR_CODES.JOURNAL_NOT_FOUND.statusCode,
        ERROR_CODES.JOURNAL_NOT_FOUND.message,
        ERROR_CODES.JOURNAL_NOT_FOUND.code,
      );

    if (existing.traveler_id !== travelerId)
      throw new AppError(
        ERROR_CODES.UNAUTHORIZED.statusCode,
        ERROR_CODES.UNAUTHORIZED.message,
        ERROR_CODES.UNAUTHORIZED.code,
      );

    await prisma.$transaction(async (tx) => {
      const images = await tx.image.findMany({
        where: { related_id: journalId, related_type: ENTITY_TYPE },
        select: { url: true },
      });

      if (images.length > 0) {
        try {
          const publicIds = images.map((img) => img.url);
          await CloudinaryService.deleteMultiple(publicIds);
        } catch (error) {
          console.warn(`Failed to delete Cloudinary images for journal ${journalId}:`, error);
        }
      }

      await tx.image.deleteMany({
        where: { related_id: journalId, related_type: ENTITY_TYPE },
      });

      await tx.travelJournal.delete({ where: { id: journalId } });
    });

    return true;
  },
};

module.exports = JournalService;
