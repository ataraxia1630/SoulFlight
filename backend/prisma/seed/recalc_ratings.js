async function recalcServiceRatings(prisma) {
  console.log("Re-calculating service ratings based on reviews...");

  const services = await prisma.service.findMany();

  let count = 0;
  for (const service of services) {
    // Tính trung bình rating từ bảng Review
    const aggregation = await prisma.review.aggregate({
      _avg: { rating: true },
      where: { service_id: service.id },
    });

    const averageRating = aggregation._avg.rating;

    if (averageRating) {
      // Làm tròn 1 chữ số thập phân
      const roundedRating = Math.round(averageRating * 10) / 10;

      // Chỉ update nếu rating thay đổi
      if (service.rating !== roundedRating) {
        await prisma.service.update({
          where: { id: service.id },
          data: { rating: roundedRating },
        });
        count++;
      }
    }
  }
  console.log(`Updated ratings for ${count} services.`);
}

module.exports = { recalcServiceRatings };
