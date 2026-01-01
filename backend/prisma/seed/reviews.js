const reviews = [
  // ========== ACCOMMODATION REVIEWS (Service 1-7) ==========
  // Service 1: Khách Sạn Sunrise Grand (có 4 rooms: id 1-4)
  {
    traveler_id: 5,
    service_id: 1,
    room_id: 1, // Phòng Deluxe View Thành Phố
    rating: 5,
    comment: "Phòng Deluxe view đẹp tuyệt vời! Dịch vụ 5 sao thật sự.",
  },
  {
    traveler_id: 6,
    service_id: 1,
    room_id: 3, // Presidential Suite
    rating: 5,
    comment: "Presidential Suite sang trọng, dịch vụ butler chu đáo!",
  },

  // Service 2: Resort Bãi Biển Sunrise (có 4 rooms: id 5-8)
  {
    traveler_id: 7,
    service_id: 2,
    room_id: 6, // Villa Bãi Biển
    rating: 5,
    comment: "Villa riêng với bể bơi tuyệt vời, bãi biển đẹp như mơ!",
  },
  {
    traveler_id: 5,
    service_id: 2,
    room_id: 5, // Bungalow View Biển
    rating: 4,
    comment: "Bungalow sát biển rất lãng mạn, sẽ quay lại!",
  },

  // Service 3: Khách Sạn Boutique Sunrise (có 4 rooms: id 9-12)
  {
    traveler_id: 6,
    service_id: 3,
    room_id: 9, // Phòng Di Sản
    rating: 5,
    comment: "Thiết kế truyền thống Việt Nam rất đẹp và ấm cúng!",
  },

  // Service 6: Resort Hạ Long (có 3 rooms: id 20-22)
  {
    traveler_id: 7,
    service_id: 6,
    room_id: 20, // Phòng View Vịnh
    rating: 5,
    comment: "View vịnh Hạ Long từ phòng tuyệt đẹp, thức dậy thấy vịnh!",
  },

  // Service 7: Khách Sạn Nha Trang (có 3 rooms: id 23-25)
  {
    traveler_id: 5,
    service_id: 7,
    room_id: 24, // Suite Nha Trang
    rating: 5,
    comment: "Suite với ban công facing biển, bình minh tuyệt vời!",
  },

  // ========== DINING REVIEWS (Service 8-14) ==========
  // Service 8: Phở Góc Trung Tâm (có 2 menus: id 1-2)
  {
    traveler_id: 5,
    service_id: 8,
    menu_id: 1, // Thực Đơn Phở Truyền Thống
    rating: 5,
    comment: "Phở ngon lắm, nước dùng đậm đà, sợi bánh mềm mại!",
  },
  {
    traveler_id: 6,
    service_id: 8,
    menu_id: 2, // Đồ Ăn Kèm & Khai Vị
    rating: 4,
    comment: "Nem cuốn tươi ngon, đúng hương vị Việt Nam!",
  },

  // Service 9: Nhà Hàng Phở Góc (có 2 menus: id 3-4)
  {
    traveler_id: 7,
    service_id: 9,
    menu_id: 3, // Món Ăn Fusion
    rating: 5,
    comment: "Fusion Việt-Tây rất lạ miệng và ngon! Sáng tạo!",
  },
  {
    traveler_id: 5,
    service_id: 9,
    menu_id: 4, // Lựa Chọn Cao Cấp
    rating: 5,
    comment: "Nguyên liệu cao cấp, trình bày đẹp mắt, đáng giá!",
  },

  // Service 10: Phở Góc Sân Thượng (có 2 menus: id 5-6)
  {
    traveler_id: 6,
    service_id: 10,
    menu_id: 5, // Thực Đơn Ăn Uống Tinh Tế
    rating: 5,
    comment: "Rooftop view thành phố tuyệt đẹp, món ăn tinh tế!",
  },
  {
    traveler_id: 7,
    service_id: 10,
    menu_id: 6, // Rượu Vang & Cocktail
    rating: 5,
    comment: "Cocktail chữ ký rất độc đáo, bartender chuyên nghiệp!",
  },

  // Service 11: Quán Cà Phê Phở Góc (có 2 menus: id 7-8)
  {
    traveler_id: 5,
    service_id: 11,
    menu_id: 7, // Lựa Chọn Cà Phê
    rating: 5,
    comment: "Cà phê sữa đá truyền thống ngon nhất từng thử!",
  },
  {
    traveler_id: 6,
    service_id: 11,
    menu_id: 8, // Bánh & Tráng Miệng
    rating: 4,
    comment: "Bánh tươi mỗi ngày, không gian quán ấm cúng!",
  },

  // Service 12: Phở Góc Đồ Ăn Đường Phố (có 2 menus: id 9-10)
  {
    traveler_id: 7,
    service_id: 12,
    menu_id: 9, // Các Món Ăn Đường Phố
    rating: 5,
    comment: "Bánh mì và bún thịt nướng đúng vị đường phố Sài Gòn!",
  },
  {
    traveler_id: 5,
    service_id: 12,
    menu_id: 10, // Đồ Ăn Nhanh
    rating: 4,
    comment: "Nhanh gọn, giá sinh viên, ngon bất ngờ!",
  },

  // ========== TOUR REVIEWS (Service 15-19) ==========
  // Service 15: Khám Phá Đồng Bằng Sông Cửu Long (có 5 tours: id 1-5)
  {
    traveler_id: 5,
    service_id: 15,
    tour_id: 1, // Khám Phá Đồng Bằng Sông Cửu Long Nguyên Ngày
    rating: 5,
    comment: "Tour toàn ngày tuyệt vời, chợ nổi Cái Răng sôi động!",
  },
  {
    traveler_id: 6,
    service_id: 15,
    tour_id: 2, // Tour Chợ Nổi Sáng Sớm
    rating: 5,
    comment: "Dậy sớm đáng giá, chợ nổi lúc 5h sáng rất đẹp!",
  },
  {
    traveler_id: 7,
    service_id: 15,
    tour_id: 3, // Tour Ẩm Thực Phiêu Lưu
    rating: 4,
    comment: "Ăn no nê cả ngày, đặc sản miền Tây ngon tuyệt!",
  },

  // Service 16: Du Thuyền Hoàng Hôn (có 1 tour: id 6)
  {
    traveler_id: 5,
    service_id: 16,
    tour_id: 6, // Du Thuyền Hoàng Hôn Trên Sông Mekong
    rating: 5,
    comment: "Hoàng hôn trên sông Mekong lãng mạn, nhạc sống tuyệt!",
  },

  // Service 17: Tour Đạp Xe Qua Làng Quê (có 1 tour: id 7)
  {
    traveler_id: 6,
    service_id: 17,
    tour_id: 7, // Tour Đạp Xe Qua Làng Quê
    rating: 4,
    comment: "Đạp xe qua làng quê yên bình, người dân thân thiện!",
  },

  // Service 18: Hành Trình Tâm Linh Núi Sam (Tour) (có 1 tour: id 8)
  {
    traveler_id: 7,
    service_id: 18,
    tour_id: 8, // Hành Trình Tâm Linh Núi Sam
    rating: 5,
    comment: "Núi Sam thiêng liêng, chùa Bà Chúa Xứ linh thiêng!",
  },

  // Service 19: Eco Tour Rừng Tràm Trà Sư (có 2 tours: id 9-10)
  {
    traveler_id: 5,
    service_id: 19,
    tour_id: 9, // Eco Tour Rừng Tràm Trà Sư
    rating: 5,
    comment: "Rừng tràm tuyệt đẹp, quan sát chim rất nhiều loài!",
  },
  {
    traveler_id: 6,
    service_id: 19,
    tour_id: 10, // Tour Nhiếp Ảnh Đồng Bằng Sông Cửu Long
    rating: 5,
    comment: "Tour nhiếp ảnh chuyên nghiệp, chụp được nhiều ảnh đẹp!",
  },

  // ========== TICKET/LEISURE REVIEWS (Service 20-24) ==========
  // Service 20: Khu Du Lịch Núi Sam (Vé) (có 4 tickets: id 1-4)
  {
    traveler_id: 5,
    service_id: 20,
    ticket_id: 1, // Cáp Treo Núi Sam - Người Lớn
    rating: 5,
    comment: "Cáp treo an toàn, view từ trên núi xuống tuyệt đẹp!",
  },
  {
    traveler_id: 6,
    service_id: 20,
    ticket_id: 2, // Cáp Treo Núi Sam - Trẻ Em
    rating: 4,
    comment: "Con tôi thích lắm, giá trẻ em phải chăng!",
  },
  {
    traveler_id: 7,
    service_id: 20,
    ticket_id: 3, // Tour Tham Quan Chùa Chiền
    rating: 5,
    comment: "Hướng dẫn viên giải thích chi tiết lịch sử chùa!",
  },

  // Service 21: Khu Bảo Tồn Rừng Tràm Trà Sư (Vé) (có 6 tickets: id 5-10)
  {
    traveler_id: 5,
    service_id: 21,
    ticket_id: 5, // Vé Vào Rừng Trà Sư - Người Lớn
    rating: 5,
    comment: "Du thuyền qua rừng tràm rất thoải mái và đẹp!",
  },
  {
    traveler_id: 6,
    service_id: 21,
    ticket_id: 6, // Vé Vào Rừng Trà Sư - Trẻ Em
    rating: 5,
    comment: "Giá thích hợp cho trẻ em, con thích chèo thuyền!",
  },
  {
    traveler_id: 7,
    service_id: 21,
    ticket_id: 7, // Tour Quan Sát Chim
    rating: 5,
    comment: "Tour quan sát chim tuyệt vời, thấy nhiều loài quý hiếm!",
  },
  {
    traveler_id: 5,
    service_id: 21,
    ticket_id: 8, // Gói Nhiếp Ảnh
    rating: 5,
    comment: "Gói nhiếp ảnh cho người yêu thích chụp ảnh, góc đẹp!",
  },
  {
    traveler_id: 6,
    service_id: 21,
    ticket_id: 9, // Tour Hoàng Hôn Đặc Biệt
    rating: 5,
    comment: "Bình minh tại rừng tràm không thể quên được!",
  },

  // Service 22: Tour Hạ Long Bay (Vé Tàu/Tham Quan) (có 3 tickets: id 11-13)
  {
    traveler_id: 7,
    service_id: 22,
    ticket_id: 11, // Vé Du Thuyền Hạ Long - Người Lớn
    rating: 5,
    comment: "Vịnh Hạ Long đẹp như tranh vẽ, du thuyền sang trọng!",
  },
  {
    traveler_id: 5,
    service_id: 22,
    ticket_id: 13, // Gói Du Thuyền Sang Trọng Hạ Long
    rating: 5,
    comment: "Du thuyền cao cấp đáng giá, buffet hải sản tuyệt!",
  },

  // Service 23: Khám Phá Phố Cổ Hội An (Vé) (có 1 ticket: id 14)
  {
    traveler_id: 6,
    service_id: 23,
    ticket_id: 14, // Vé Phố Cổ Hội An
    rating: 5,
    comment: "Phố cổ Hội An lãng mạn, kiến trúc cổ kính!",
  },

  // Service 24: Trekking Sapa (Vé/Dịch vụ) (có 2 tickets: id 15-16)
  {
    traveler_id: 7,
    service_id: 24,
    ticket_id: 15, // Tour Trekking Sapa - Cơ Bản
    rating: 4,
    comment: "Tour cơ bản phù hợp người mới, ruộng bậc thang đẹp!",
  },
  {
    traveler_id: 5,
    service_id: 24,
    ticket_id: 16, // Tour Trekking Sapa - Nâng Cao
    rating: 5,
    comment: "Tour nâng cao thử thách nhưng cảnh đẹp tuyệt vời!",
  },
];

async function seedReviews(prisma) {
  console.log("Seeding reviews with correct relationships...");

  for (const review of reviews) {
    // Kiểm tra xem review đã tồn tại chưa
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
      console.log(`Updated review for service ${review.service_id}`);
    } else {
      await prisma.review.create({ data: review });
      console.log(`Created review for service ${review.service_id}`);
    }
  }

  console.log(`Seeded ${reviews.length} reviews with correct relationships`);
}

module.exports = { seedReviews };
