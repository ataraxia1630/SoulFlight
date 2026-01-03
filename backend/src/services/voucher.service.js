const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");
// const { ERROR_CODES } = require('../constants/errorCode');

const VoucherService = {
  async createVoucher(userId, isAdmin, voucherData) {
    const {
      serviceId,
      title,
      code,
      discountPercent,
      description,
      validFrom,
      validTo,
      isGlobal,
      maxUses,
    } = voucherData;

    if (isGlobal && !isAdmin) {
      throw new AppError(403, "Chỉ admin mới có thể tạo voucher global", "FORBIDDEN");
    }

    if (!isGlobal && !serviceId) {
      throw new AppError(400, "Voucher không global phải có serviceId", "INVALID_DATA");
    }

    if (!isAdmin && serviceId) {
      const service = await prisma.service.findFirst({
        where: {
          id: serviceId,
          provider_id: userId,
        },
      });

      if (!service) {
        throw new AppError(403, "Bạn không có quyền tạo voucher cho service này", "FORBIDDEN");
      }
    }

    const existingCode = await prisma.voucher.findUnique({
      where: { code },
    });

    if (existingCode) {
      throw new AppError(400, "Mã voucher đã tồn tại", "VOUCHER_CODE_EXISTS");
    }

    if (validFrom && validTo && new Date(validFrom) >= new Date(validTo)) {
      throw new AppError(400, "validFrom phải trước validTo", "INVALID_DATES");
    }

    if (discountPercent < 0 || discountPercent > 100) {
      throw new AppError(400, "Discount phải từ 0-100%", "INVALID_DISCOUNT");
    }

    const voucher = await prisma.voucher.create({
      data: {
        service_id: isGlobal ? null : serviceId,
        title,
        code: code.toUpperCase(),
        discount_percent: discountPercent,
        description,
        valid_from: validFrom ? new Date(validFrom) : null,
        valid_to: validTo ? new Date(validTo) : null,
        is_global: isGlobal,
        max_uses: maxUses || null,
        used_count: 0,
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return voucher;
  },

  async getAvailableVouchers({ serviceId }) {
    const now = new Date();

    const where = {
      OR: [
        { is_global: true },
        ...(serviceId ? [{ service_id: serviceId }] : []),
        { valid_from: null, valid_to: null },
        {
          AND: [
            { valid_from: { lte: now } },
            { OR: [{ valid_to: null }, { valid_to: { gte: now } }] },
          ],
        },
        { max_uses: null },
        { used_count: { lt: prisma.voucher.fields.max_uses } },
      ],
    };

    const [vouchers] = await Promise.all([
      prisma.voucher.findMany({
        where,
        include: {
          service: {
            select: {
              id: true,
              name: true,
              type_id: true,
            },
          },
        },
        orderBy: [{ discount_percent: "desc" }, { created_at: "desc" }],
      }),
    ]);

    return vouchers;
  },

  async checkVoucher(code, serviceId = null, totalAmount = 0) {
    const voucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!voucher) {
      throw new AppError(404, "Không tìm thấy mã voucher", "VOUCHER_NOT_FOUND");
    }

    const now = new Date();
    const errors = [];

    if (voucher.valid_from && new Date(voucher.valid_from) > now) {
      errors.push(
        `Voucher chưa có hiệu lực. Bắt đầu từ ${new Date(voucher.valid_from).toLocaleDateString(
          "vi-VN",
        )}`,
      );
    }

    if (voucher.valid_to && new Date(voucher.valid_to) < now) {
      errors.push(
        `Voucher đã hết hạn vào ${new Date(voucher.valid_to).toLocaleDateString("vi-VN")}`,
      );
    }

    if (voucher.max_uses && voucher.used_count >= voucher.max_uses) {
      errors.push("Voucher đã hết lượt sử dụng");
    }

    if (!voucher.is_global && serviceId && voucher.service_id !== serviceId) {
      errors.push(`Voucher chỉ áp dụng cho dịch vụ "${voucher.service?.name}"`);
    }

    if (errors.length > 0) {
      return {
        valid: false,
        voucher,
        errors,
        discountAmount: 0,
      };
    }

    const discountAmount = totalAmount * (voucher.discount_percent / 100);

    return {
      valid: true,
      voucher,
      errors: [],
      discountAmount,
      finalAmount: totalAmount - discountAmount,
    };
  },

  async getVoucherById(voucherId) {
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            Provider: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        bookings: {
          select: {
            id: true,
            traveler_id: true,
            total_amount: true,
            discount_amount: true,
            created_at: true,
          },
          take: 10,
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (!voucher) {
      throw new AppError(404, "Không tìm thấy voucher", "VOUCHER_NOT_FOUND");
    }

    return voucher;
  },

  async getProviderVouchers(providerId, { status }) {
    const where = {
      service: {
        provider_id: providerId,
      },
    };

    const now = new Date();
    if (status === "active") {
      where.AND = [
        {
          OR: [
            { valid_from: null, valid_to: null },
            {
              AND: [
                { valid_from: { lte: now } },
                { OR: [{ valid_to: null }, { valid_to: { gte: now } }] },
              ],
            },
          ],
        },
        {
          OR: [{ max_uses: null }, { used_count: { lt: prisma.voucher.fields.max_uses } }],
        },
      ];
    } else if (status === "expired") {
      where.valid_to = { lt: now };
    } else if (status === "upcoming") {
      where.valid_from = { gt: now };
    } else if (status === "exhausted") {
      where.used_count = { gte: prisma.voucher.fields.max_uses };
    }

    const [vouchers] = await Promise.all([
      prisma.voucher.findMany({
        where,
        include: {
          service: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { bookings: true },
          },
        },
        orderBy: { created_at: "desc" },
      }),
    ]);

    return vouchers;
  },

  async getAllVouchers({ status, isGlobal, serviceId }) {
    const where = {};

    if (typeof isGlobal !== "undefined") {
      where.is_global = isGlobal === "true" || isGlobal === true;
    }

    if (serviceId) {
      where.service_id = Number(serviceId);
    }

    const now = new Date();
    if (status === "active") {
      where.AND = [
        {
          OR: [
            { valid_from: null, valid_to: null },
            {
              AND: [
                { valid_from: { lte: now } },
                { OR: [{ valid_to: null }, { valid_to: { gte: now } }] },
              ],
            },
          ],
        },
        {
          OR: [{ max_uses: null }, { used_count: { lt: prisma.voucher.fields.max_uses } }],
        },
      ];
    } else if (status === "expired") {
      where.valid_to = { lt: now };
    } else if (status === "upcoming") {
      where.valid_from = { gt: now };
    } else if (status === "exhausted") {
      where.used_count = { gte: prisma.voucher.fields.max_uses };
    }

    const [vouchers] = await Promise.all([
      prisma.voucher.findMany({
        where,
        include: {
          service: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { bookings: true },
          },
        },
        orderBy: { created_at: "desc" },
      }),
    ]);
    console.log("All vouchers fetched:", vouchers);
    return vouchers;
  },

  async updateVoucher(voucherId, userId, isAdmin, updateData) {
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
      include: {
        service: true,
      },
    });

    if (!voucher) {
      throw new AppError(404, "Không tìm thấy voucher", "VOUCHER_NOT_FOUND");
    }

    if (!isAdmin) {
      if (voucher.is_global) {
        throw new AppError(403, "Chỉ admin mới có thể sửa voucher global", "FORBIDDEN");
      }

      if (voucher.service && voucher.service.provider_id !== userId) {
        throw new AppError(403, "Bạn không có quyền sửa voucher này", "FORBIDDEN");
      }
    }

    if (updateData.code && updateData.code !== voucher.code) {
      const existingCode = await prisma.voucher.findUnique({
        where: { code: updateData.code.toUpperCase() },
      });

      if (existingCode) {
        throw new AppError(400, "Mã voucher đã tồn tại", "VOUCHER_CODE_EXISTS");
      }
    }

    const validFrom = updateData.validFrom || voucher.valid_from;
    const validTo = updateData.validTo || voucher.valid_to;

    if (validFrom && validTo && new Date(validFrom) >= new Date(validTo)) {
      throw new AppError(400, "validFrom phải trước validTo", "INVALID_DATES");
    }

    if (updateData.discountPercent !== undefined) {
      if (updateData.discountPercent < 0 || updateData.discountPercent > 100) {
        throw new AppError(400, "Discount phải từ 0-100%", "INVALID_DISCOUNT");
      }
    }

    const updated = await prisma.voucher.update({
      where: { id: voucherId },
      data: {
        ...(updateData.title && { title: updateData.title }),
        ...(updateData.code && { code: updateData.code.toUpperCase() }),
        ...(updateData.discountPercent !== undefined && {
          discount_percent: updateData.discountPercent,
        }),
        ...(updateData.description !== undefined && {
          description: updateData.description,
        }),
        ...(updateData.validFrom !== undefined && {
          valid_from: updateData.validFrom ? new Date(updateData.validFrom) : null,
        }),
        ...(updateData.validTo !== undefined && {
          valid_to: updateData.validTo ? new Date(updateData.validTo) : null,
        }),
        ...(updateData.maxUses !== undefined && {
          max_uses: updateData.maxUses,
        }),
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updated;
  },

  async deleteVoucher(voucherId, userId, isAdmin) {
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
      include: {
        service: true,
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!voucher) {
      throw new AppError(404, "Không tìm thấy voucher", "VOUCHER_NOT_FOUND");
    }

    if (!isAdmin) {
      if (voucher.is_global) {
        throw new AppError(403, "Chỉ admin mới có thể xóa voucher global", "FORBIDDEN");
      }

      if (voucher.service && voucher.service.provider_id !== userId) {
        throw new AppError(403, "Bạn không có quyền xóa voucher này", "FORBIDDEN");
      }
    }

    if (voucher._count.bookings > 0) {
      throw new AppError(
        400,
        "Không thể xóa voucher đã được sử dụng trong bookings",
        "VOUCHER_IN_USE",
      );
    }

    await prisma.voucher.delete({
      where: { id: voucherId },
    });

    return { success: true, message: "Voucher đã được xóa" };
  },

  async getVoucherStats(voucherId, userId, isAdmin) {
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
      include: {
        service: true,
      },
    });

    if (!voucher) {
      throw new AppError(404, "Không tìm thấy voucher", "VOUCHER_NOT_FOUND");
    }

    if (!isAdmin && voucher.service && voucher.service.provider_id !== userId) {
      throw new AppError(403, "Không có quyền xem thống kê voucher này", "FORBIDDEN");
    }

    const bookings = await prisma.booking.findMany({
      where: { voucher_id: voucherId },
      include: {
        traveler: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    const stats = {
      totalUsage: voucher.used_count,
      maxUses: voucher.max_uses,
      remainingUses: voucher.max_uses ? voucher.max_uses - voucher.used_count : null,
      totalRevenue: bookings.reduce((sum, b) => sum + Number(b.total_amount), 0),
      totalDiscount: bookings.reduce((sum, b) => sum + Number(b.discount_amount), 0),
      averageDiscount:
        bookings.length > 0
          ? bookings.reduce((sum, b) => sum + Number(b.discount_amount), 0) / bookings.length
          : 0,
      recentBookings: bookings.slice(0, 10),
    };

    return stats;
  },
};

module.exports = { VoucherService };
