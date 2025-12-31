// const { upsertMany } = require("./utils/upsertMany");

const reviews = [
  {
    traveler_id: 5,
    service_id: 1,
    rating: 5,
    comment: "Dịch vụ tuyệt vời, nhân viên rất thân thiện!",
  },
  {
    traveler_id: 6,
    service_id: 1,
    rating: 4,
    comment: "Phòng sạch sẽ, tiện nghi đầy đủ. Quá tuyệt vời!",
  },
  {
    traveler_id: 7,
    service_id: 2,
    rating: 5,
    comment: "Bãi biển tuyệt đẹp, resort sang trọng.",
  },
  {
    traveler_id: 5,
    service_id: 2,
    rating: 4,
    comment: "Rất thoải mái, có thể sẽ quay lại.",
  },
  {
    traveler_id: 6,
    service_id: 3,
    rating: 5,
    comment: "Vị trí đẹp, dịch vụ tuyệt vời.",
  },

  {
    traveler_id: 5,
    service_id: 6,
    rating: 5,
    comment: "Phở ngon lắm, sợi bánh mềm mại.",
  },
  {
    traveler_id: 6,
    service_id: 6,
    rating: 4,
    comment: "Đúng như mong đợi, đáng giá.",
  },
  {
    traveler_id: 7,
    service_id: 7,
    rating: 5,
    comment: "Nơi tuyệt vời để thử ẩm thực Việt Nam!",
  },
  {
    traveler_id: 5,
    service_id: 7,
    rating: 4,
    comment: "Thực phẩm tươi ngon, giá hợp lý.",
  },
  {
    traveler_id: 6,
    service_id: 8,
    rating: 5,
    comment: "Tầng rooftop tuyệt đẹp, ẩm thực lạ miệng.",
  },

  {
    traveler_id: 5,
    service_id: 14,
    tour_id: 1,
    rating: 5,
    comment: "Tour tuyệt vời, hướng dẫn viên rất chuyên nghiệp!",
  },
  {
    traveler_id: 6,
    service_id: 15,
    tour_id: 2,
    rating: 5,
    comment: "Du thuyền tuyệt đẹp, bữa tối lãng mạn.",
  },
  {
    traveler_id: 7,
    service_id: 16,
    tour_id: 3,
    rating: 4,
    comment: "Trải nghiệm thú vị, cảnh đẹp lắm.",
  },
  {
    traveler_id: 5,
    service_id: 17,
    tour_id: 4,
    rating: 5,
    comment: "Núi Sam thật thiêng liêng, chùa chiền đẹp.",
  },
  {
    traveler_id: 6,
    service_id: 18,
    tour_id: 5,
    rating: 5,
    comment: "Rừng tràm thật tuyệt đẹp, chim bay rất nhiều!",
  },

  {
    traveler_id: 5,
    service_id: 17,
    ticket_id: 1,
    rating: 5,
    comment: "Cáp treo an toàn, view tuyệt đẹp!",
  },
  {
    traveler_id: 6,
    service_id: 17,
    ticket_id: 2,
    rating: 4,
    comment: "Con tôi thích lắm, giá phải chăng.",
  },
  {
    traveler_id: 7,
    service_id: 17,
    ticket_id: 3,
    rating: 5,
    comment: "Hướng dẫn viên tuyệt vời, thông tin chi tiết.",
  },
  {
    traveler_id: 5,
    service_id: 18,
    ticket_id: 5,
    rating: 5,
    comment: "Cảnh rừng tượng tuyệt đẹp, du thuyền thoải mái.",
  },
  {
    traveler_id: 6,
    service_id: 18,
    ticket_id: 6,
    rating: 5,
    comment: "Giá thích hợp cho con nhỏ, chuyến đi vui vẻ.",
  },
  {
    traveler_id: 5,
    service_id: 18,
    ticket_id: 7,
    rating: 5,
    comment: "Du thuyền chim tuyệt vời, quan sát được nhiều chim!",
  },
  {
    traveler_id: 6,
    service_id: 18,
    ticket_id: 8,
    rating: 5,
    comment: "Gói nhiếp ảnh tuyệt vời cho những ai yêu thích chụp ảnh.",
  },
  {
    traveler_id: 7,
    service_id: 18,
    ticket_id: 9,
    rating: 5,
    comment: "Bình minh tuyệt đẹp, trải nghiệm không thể quên!",
  },
];

async function seedReviews(prisma) {
  console.log("Seeding reviews...");

  for (const review of reviews) {
    const existingReview = await prisma.review
      .findFirst({
        where: {
          traveler_id: review.traveler_id,
          service_id: review.service_id,
          room_id: review.room_id || null,
          tour_id: review.tour_id || null,
          ticket_id: review.ticket_id || null,
          menu_id: review.menu_id || null,
        },
      })
      .catch(() => null);

    if (existingReview) {
      await prisma.review.update({
        where: { id: existingReview.id },
        data: review,
      });
    } else {
      await prisma.review.create({ data: review });
    }
  }

  console.log(`Seeded ${reviews.length} reviews`);
}

module.exports = { seedReviews };
