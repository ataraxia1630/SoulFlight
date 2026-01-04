const prisma = require("../configs/prisma");
const AppError = require("../utils/AppError");

const StatisticService = {
  async getStatistics(userId, filters = {}) {
    const { year, month } = filters;

    console.log("[Statistics] Request from userId:", userId, "Filters:", {
      year,
      month,
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Provider: true },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    let role = user.is_admin ? "ADMIN" : "UNKNOWN";
    const where = {
      status: {
        in: ["PAID", "COMPLETED", "IN_PROGRESS"],
      },
      payment: { status: "SUCCESS" },
    };

    if (role === "UNKNOWN" && user.Provider) {
      role = "PROVIDER";
      where.provider_id = userId;
      console.log("[Statistics] Role: PROVIDER, provider_id:", userId);
    } else if (role === "UNKNOWN") {
      throw new AppError(403, "Unauthorized access to statistics.");
    } else {
      console.log("[Statistics] Role: ADMIN - xem toàn hệ thống");
    }

    if (year) {
      const startOfYear = new Date(Date.UTC(year, 0, 1));
      const endOfYear = new Date(Date.UTC(year + 1, 0, 1));

      where.created_at = {
        gte: startOfYear,
        lt: endOfYear,
      };

      if (month) {
        const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
        const endOfMonth = new Date(Date.UTC(year, month, 1));

        where.created_at = {
          gte: startOfMonth,
          lt: endOfMonth,
        };
        console.log(
          `[Statistics] Filter tháng ${month}/${year}:`,
          startOfMonth.toISOString(),
          "→",
          endOfMonth.toISOString(),
        );
      } else {
        console.log(
          `[Statistics] Filter năm ${year}:`,
          startOfYear.toISOString(),
          "→",
          endOfYear.toISOString(),
        );
      }
    }

    const [totalRevenue, totalBookings, bookings] = await Promise.all([
      prisma.booking.aggregate({
        where,
        _sum: { final_amount: true },
      }),
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: { service: true },
      }),
    ]);

    const serviceStats = {};
    bookings.forEach((b) => {
      if (!b.service) return;
      const sid = b.service_id;
      if (!serviceStats[sid]) {
        serviceStats[sid] = {
          name: b.service.name,
          count: 0,
          revenue: 0,
          avg_rating: b.service.rating || 0,
        };
      }
      serviceStats[sid].count += 1;
      serviceStats[sid].revenue += parseFloat(b.final_amount || 0);
    });

    const topServices = Object.values(serviceStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    console.log(
      "[Statistics] Top services:",
      topServices.map((s) => `${s.name}: ${s.revenue} VND`),
    );

    let monthlyRevenue = [];
    if (year && !month) {
      console.log("[Statistics] Đang tính doanh thu 12 tháng...");
      const promises = [];
      for (let m = 1; m <= 12; m++) {
        const start = new Date(Date.UTC(year, m - 1, 1));
        const end = new Date(Date.UTC(year, m, 1));

        promises.push(
          prisma.booking
            .aggregate({
              where: {
                ...where,
                created_at: { gte: start, lt: end },
              },
              _sum: { final_amount: true },
            })
            .then((res) => ({
              month: m,
              revenue: parseFloat(res._sum?.final_amount || 0),
            }))
            .catch((err) => {
              console.error(`[Statistics] Lỗi tháng ${m}:`, err);
              return { month: m, revenue: 0 };
            }),
        );
      }
      monthlyRevenue = await Promise.all(promises);
      console.log("[Statistics] Doanh thu các tháng:", monthlyRevenue);
    }

    const result = {
      totalRevenue: parseFloat(totalRevenue._sum?.final_amount || 0),
      totalBookings,
      topServices,
      monthlyRevenue,
    };

    console.log("[Statistics] Kết quả trả về:", {
      totalRevenue: result.totalRevenue,
      totalBookings: result.totalBookings,
      topServicesCount: result.topServices.length,
      monthlyRevenueLength: result.monthlyRevenue.length,
    });

    return result;
  },
};

module.exports = StatisticService;
