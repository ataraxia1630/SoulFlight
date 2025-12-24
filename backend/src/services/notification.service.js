const prisma = require("../configs/prisma");
const { NotificationDTO } = require("../dtos/notification.dto");
const AppError = require("../utils/AppError");

const NotificationService = {
  // tạo thông báo để các hàm khác gọi lại
  create: async ({ userId, title, message, type, relatedId }) => {
    return await prisma.notification.create({
      data: {
        user_id: userId,
        title,
        message,
        type,
        related_id: relatedId ? String(relatedId) : null,
      },
    });
  },

  getAll: async (userId) => {
    const notifications = await prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
    return NotificationDTO.fromList(notifications);
  },

  getById: async (id, userId) => {
    const parsedId = parseInt(id, 10);

    const notification = await prisma.notification.findFirst({
      where: {
        id: parsedId,
        user_id: userId,
      },
    });

    if (!notification) {
      throw new AppError(
        ERROR_CODES.NOTIFICATION_NOT_FOUND.statusCode,
        ERROR_CODES.NOTIFICATION_NOT_FOUND.message,
        ERROR_CODES.NOTIFICATION_NOT_FOUND.code,
      );
    }

    return NotificationDTO.fromModel(notification);
  },

  countUnread: async (userId) => {
    const count = await prisma.notification.count({
      where: { user_id: userId, is_read: false },
    });
    return { count };
  },

  markAsRead: async (id, userId) => {
    const parsedId = parseInt(id, 10);
    await prisma.notification.updateMany({
      where: {
        id: parsedId,
        user_id: userId,
      },
      data: { is_read: true },
    });
    return null;
  },

  markAllAsRead: async (userId) => {
    await prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });
    return null;
  },

  delete: async (id, userId) => {
    const parsedId = parseInt(id, 10);

    const result = await prisma.notification.deleteMany({
      where: {
        id: parsedId,
        user_id: userId,
      },
    });

    if (result.count === 0) {
      throw new AppError(
        ERROR_CODES.NOTIFICATION_NOT_FOUND.statusCode,
        ERROR_CODES.NOTIFICATION_NOT_FOUND.message,
        ERROR_CODES.NOTIFICATION_NOT_FOUND.code,
      );
    }

    return null;
  },

  deleteAll: async (userId) => {
    await prisma.notification.deleteMany({
      where: { user_id: userId },
    });
    return null;
  },
};

module.exports = NotificationService;
