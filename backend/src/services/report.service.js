const prisma = require("../configs/prisma");
const NotificationService = require("./notification.service");
const { ReportDTO } = require("../dtos/report.dto");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const ReportService = {
  create: async (data, reporterId) => {
    const report = await prisma.report.create({
      data: {
        reporter_id: reporterId,
        provider_id: parseInt(data.provider_id, 10),
        content: data.content,
      },
      include: {
        provider: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    const providerName = report.provider.user.name;
    const admins = await prisma.user.findMany({
      where: { is_admin: true, status: "ACTIVE" },
      select: { id: true },
    });

    if (admins.length > 0) {
      const notificationPromises = admins.map((admin) =>
        NotificationService.create({
          userId: admin.id,
          title: "Tố cáo vi phạm",
          message: `Người dùng đã tố cáo Provider: ${providerName}. Nội dung: ${data.content}`,
          type: "REPORT_CREATED",
          relatedId: String(report.id),
        }),
      );
      await Promise.all(notificationPromises);
    }

    return ReportDTO.fromModel(report);
  },

  getAll: async () => {
    const reports = await prisma.report.findMany({
      include: {
        reporter: { include: { user: true } },
        provider: { include: { user: true } },
      },
      orderBy: { created_at: "desc" },
    });
    return ReportDTO.fromList(reports);
  },

  getById: async (id) => {
    const report = await prisma.report.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        reporter: { include: { user: true } },
        provider: { include: { user: true } },
      },
    });

    if (!report)
      throw new AppError(
        ERROR_CODES.REPORT_NOT_FOUND.statusCode,
        ERROR_CODES.REPORT_NOT_FOUND.message,
        ERROR_CODES.REPORT_NOT_FOUND.code,
      );
    return ReportDTO.fromModel(report);
  },

  update: async (id, status) => {
    const report = await prisma.report.update({
      where: { id: parseInt(id, 10) },
      data: { status },
      include: {
        provider: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    if (status === "RESOLVED") {
      const providerName = report.provider.user.name;

      await NotificationService.create({
        userId: report.reporter_id,
        title: "Kết quả xử lý tố cáo",
        message: `Cảm ơn bạn đã phản hồi. Chúng tôi đã xử lý xong tố cáo của bạn đối với Provider: ${providerName}.`,
        type: "REPORT_RESOLVED",
        relatedId: report.id,
      });

      await NotificationService.create({
        userId: report.provider_id,
        title: "Cảnh báo vi phạm",
        message:
          "Chúng tôi đã nhận được tố cáo về dịch vụ của bạn và đã tiến hành xử lý. Vui lòng tuân thủ quy định của hệ thống.",
        type: "SYSTEM_INFO",
        relatedId: report.id,
      });
    }

    return ReportDTO.fromModel(report);
  },
};

module.exports = ReportService;
