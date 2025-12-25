const prisma = require("../configs/prisma");
const NotificationService = require("./notification.service");
const { ReviewDTO } = require("../dtos/review.dto");
const AppError = require("../utils/AppError");
const { ERROR_CODES } = require("../constants/errorCode");

const ReviewService = {
  _updateServiceRating: async (serviceId) => {
    const stats = await prisma.review.aggregate({
      where: { service_id: serviceId },
      _avg: { rating: true },
      _count: { id: true },
    });

    const newRating = stats._avg.rating || 0;

    await prisma.service.update({
      where: { id: serviceId },
      data: { rating: parseFloat(newRating.toFixed(1)) },
    });
  },

  create: async (data, travelerId) => {
    const sId = parseInt(data.service_id);
    const review = await prisma.review.create({
      data: {
        traveler_id: travelerId,
        service_id: sId,
        room_id: data.room_id ? parseInt(data.room_id) : null,
        tour_id: data.tour_id ? parseInt(data.tour_id) : null,
        ticket_id: data.ticket_id ? parseInt(data.ticket_id) : null,
        menu_id: data.menu_id ? parseInt(data.menu_id) : null,
        rating: parseInt(data.rating),
        comment: data.comment,
      },
      include: {
        service: { select: { name: true, provider_id: true } },
        traveler: { include: { user: { select: { name: true } } } },
      },
    });

    await ReviewService._updateServiceRating(sId);

    const serviceName = review.service.name;
    const reviewerName = review.traveler.user.name;
    const rating = review.rating;

    const shortComment = review.comment
      ? ` Nhận xét: "${
          review.comment.length > 50 ? review.comment.slice(0, 50) + "…" : review.comment
        }".`
      : "";

    await NotificationService.create({
      userId: review.service.provider_id,
      title: "Đánh giá mới",
      message: `Khách hàng ${reviewerName} đã đánh giá ${rating} sao cho dịch vụ "${serviceName}".${shortComment}`,
      type: "REVIEW_CREATED",
      relatedId: String(review.service_id),
    });

    return ReviewDTO.fromModel(review);
  },

  update: async (id, data, travelerId) => {
    const reviewId = parseInt(id);

    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing || existing.traveler_id !== travelerId) {
      throw new AppError(
        ERROR_CODES.REVIEW_FORBIDDEN.statusCode,
        ERROR_CODES.REVIEW_FORBIDDEN.message,
        ERROR_CODES.REVIEW_FORBIDDEN.code,
      );
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating ? parseInt(data.rating) : existing.rating,
        comment: data.comment || existing.comment,
      },
      include: { traveler: { include: { user: true } }, service: true },
    });

    if (data.rating) {
      await ReviewService._updateServiceRating(updatedReview.service_id);
    }

    return ReviewDTO.fromModel(updatedReview);
  },

  delete: async (id, travelerId) => {
    const reviewId = parseInt(id);
    const existing = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!existing || existing.traveler_id !== travelerId) {
      throw new AppError(
        ERROR_CODES.REVIEW_FORBIDDEN.statusCode,
        ERROR_CODES.REVIEW_FORBIDDEN.message,
        ERROR_CODES.REVIEW_FORBIDDEN.code,
      );
    }

    await prisma.review.delete({ where: { id: reviewId } });

    await ReviewService._updateServiceRating(existing.service_id);

    return null;
  },

  getByService: async (serviceId) => {
    const reviews = await prisma.review.findMany({
      where: { service_id: parseInt(serviceId) },
      include: {
        traveler: { include: { user: true } },
        service: true,
        room: true,
        tour: true,
        ticket: true,
        menu: true,
      },
      orderBy: { created_at: "desc" },
    });
    return ReviewDTO.fromList(reviews);
  },

  getByDetailService: async (filters) => {
    const { roomId, tourId, ticketId, menuId } = filters;
    const where = {};
    if (roomId) where.room_id = parseInt(roomId);
    if (tourId) where.tour_id = parseInt(tourId);
    if (ticketId) where.ticket_id = parseInt(ticketId);
    if (menuId) where.menu_id = parseInt(menuId);

    const reviews = await prisma.review.findMany({
      where,
      include: {
        traveler: { include: { user: true } },
        service: true,
        room: true,
        tour: true,
        ticket: true,
        menu: true,
      },
      orderBy: { created_at: "desc" },
    });
    return ReviewDTO.fromList(reviews);
  },
};

module.exports = ReviewService;
