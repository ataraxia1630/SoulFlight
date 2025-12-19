// import axios from "axios";

// const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/review`;

const ReviewService = {
  // mock data
  getByService: async (_serviceId) => {
    return {
      data: [
        {
          id: 1,
          user_name: "Nguyễn Văn A",
          user_avatar: `https://ui-avatars.com/api/?name=Nguyen+Van+A&background=4CAF50`,
          rating: 5,
          comment:
            "Dịch vụ tuyệt vời! Phòng sạch sẽ, view đẹp, nhân viên thân thiện. Nhất định sẽ quay lại.",
          created_at: "2024-12-10T10:30:00Z",
        },
        {
          id: 2,
          user_name: "Trần Thị B",
          user_avatar: `https://ui-avatars.com/api/?name=Tran+Thi+B&background=2196F3`,
          rating: 4,
          comment: "Tốt, vị trí thuận lợi. Bữa sáng buffet đa dạng. Giá hơi cao một chút.",
          created_at: "2024-12-08T14:20:00Z",
        },
        {
          id: 3,
          user_name: "Lê Minh C",
          user_avatar: `https://ui-avatars.com/api/?name=Le+Minh+C&background=FF9800`,
          rating: 5,
          comment:
            "Dịch vụ 5 sao thực sự! Các tiện ích rất tuyệt, không gian thoải mái và sang trọng.",
          created_at: "2024-12-05T09:15:00Z",
        },
        {
          id: 4,
          user_name: "Phạm Thị D",
          user_avatar: `https://ui-avatars.com/api/?name=Pham+Thi+D&background=E91E63`,
          rating: 4,
          comment: "Không gian rộng rãi, sạch sẽ. Nhân viên nhiệt tình, chu đáo.",
          created_at: "2024-12-01T16:45:00Z",
        },
        {
          id: 5,
          user_name: "Hoàng Văn E",
          user_avatar: `https://ui-avatars.com/api/?name=Hoang+Van+E&background=9C27B0`,
          rating: 5,
          comment: "Trải nghiệm tuyệt vời từ khi đặt cho đến khi sử dụng dịch vụ. Rất hài lòng!",
          created_at: "2024-11-28T11:00:00Z",
        },
      ],
    };
  },
};

export default ReviewService;
