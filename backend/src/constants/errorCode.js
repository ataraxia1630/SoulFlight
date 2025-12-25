const ERROR_CODES = {
  //token
  INVALID_ACCESS_TOKEN: {
    message: "Invalid access token",
    statusCode: 401,
    code: "INVALID_ACCESS_TOKEN",
  },
  INVALID_REFRESH_TOKEN: {
    message: "Invalid refresh token",
    statusCode: 401,
    code: "INVALID_REFRESH_TOKEN",
  },
  EXPIRED_ACCESS_TOKEN: {
    message: "Access token has expired or not found",
    statusCode: 401,
    code: "EXPIRED_ACCESS_TOKEN",
  },
  EXPIRED_REFRESH_TOKEN: {
    message: "Refresh token has expired or not found",
    statusCode: 401,
    code: "EXPIRED_REFRESH_TOKEN",
  },
  REVOKED_REFRESH_TOKEN: {
    message: "Refresh token has been revoked",
    statusCode: 401,
    code: "REVOKED_REFRESH_TOKEN",
  },

  //signup
  INVALID_CREDENTIALS: {
    message: "Invalid email or password",
    statusCode: 401,
    code: "INVALID_CREDENTIALS",
  },
  EMAIL_REGISTERED: {
    message: "Email already registered",
    statusCode: 400,
    code: "EMAIL_REGISTERED",
  },

  //otp
  OTP_EXPIRED: {
    message: "OTP has expired or not found",
    statusCode: 400,
    code: "OTP_EXPIRED",
  },
  OTP_INVALID: {
    message: "Invalid OTP",
    statusCode: 400,
    code: "OTP_INVALID",
  },
  OTP_LIMIT_EXCEEDED: {
    message: "OTP request limit exceeded. Please try again later.",
    statusCode: 429,
    code: "OTP_LIMIT_EXCEEDED",
  },

  //create user
  INVALID_VERIFICATION_TOKEN: {
    message: "Invalid or expired verification token",
    statusCode: 400,
    code: "INVALID_VERIFICATION_TOKEN",
  },
  USERNAME_TAKEN: {
    message: "Username already taken",
    statusCode: 400,
    code: "USERNAME_TAKEN",
  },
  PHONE_REGISTERED: {
    message: "Phone number already registered",
    statusCode: 400,
    code: "PHONE_REGISTERED",
  },
  EMAIL_MISMATCH: {
    message: "Email mismatch",
    statusCode: 400,
    code: "EMAIL_MISMATCH",
  },

  USER_NOT_FOUND: {
    message: "User not found",
    statusCode: 404,
    code: "USER_NOT_FOUND",
  },

  //login
  WRONG_CREDENTIALS: {
    message: "Wrong username/email or password",
    statusCode: 401,
    code: "WRONG_CREDENTIALS",
  },
  ACCOUNT_LOCKED: {
    message: "Account is locked. Please contact support.",
    statusCode: 403,
    code: "ACCOUNT_LOCKED",
  },

  //missing fields
  MISSING_FIELDS: {
    message: "Missing required fields",
    statusCode: 400,
    code: "MISSING_FIELDS",
  },

  //profile
  PROFILE_NOT_FOUND: {
    message: "Profile not found",
    statusCode: 404,
    code: "PROFILE_NOT_FOUND",
  },
  PROFILE_ALREADY_EXISTS: {
    message: "Profile already exists",
    statusCode: 400,
    code: "PROFILE_ALREADY_EXISTS",
  },

  //menu
  MENU_NOT_FOUND: {
    message: "Menu not found",
    statusCode: 404,
    code: "MENU_NOT_FOUND",
  },

  //menu item
  MENU_ITEM_NOT_FOUND: {
    message: "Menu Item not found",
    statusCode: 404,
    code: "MENU_ITEM_NOT_FOUND",
  },

  //service tag
  SERVICE_TAG_NOT_FOUND: {
    message: "Service Tag not found",
    statusCode: 404,
    code: "SERVICE_TAG_NOT_FOUND",
  },

  //service type
  SERVICE_TYPE_NOT_FOUND: {
    message: "Service Type not found",
    statusCode: 404,
    code: "SERVICE_TYPE_NOT_FOUND",
  },

  //service
  NOT_FOUND: {
    message: "Service not found",
    statusCode: 404,
    code: "NOT_FOUND",
  },

  //cloudinary
  CLOUDINARY_UPLOAD_FAILED: {
    message: "Failed to upload image",
    statusCode: 400,
    code: "CLOUDINARY_UPLOAD_FAILED",
  },
  CLOUDINARY_DELETE_FAILED: {
    message: "Failed to delete image",
    statusCode: 400,
    code: "CLOUDINARY_DELETE_FAILED",
  },
  PUBLIC_ID_REQUIRED: {
    message: "Public ID is required",
    statusCode: 400,
    code: "PUBLIC_ID_REQUIRED",
  },
  PUBLIC_IDS_REQUIRED: {
    message: "At least one public ID is required",
    statusCode: 400,
    code: "PUBLIC_IDS_REQUIRED",
  },
  IMAGE_NOT_FOUND: {
    message: "Image not found or already deleted",
    statusCode: 404,
    code: "IMAGE_NOT_FOUND",
  },
  IMAGE_REQUIRED: {
    message: "Image file is required",
    statusCode: 400,
    code: "IMAGE_REQUIRED",
  },
  IMAGES_REQUIRED: {
    message: "At least one image is required",
    statusCode: 400,
    code: "IMAGES_REQUIRED",
  },
  TOO_MANY_IMAGES: {
    message: "Maximum 10 images allowed",
    statusCode: 400,
    code: "TOO_MANY_IMAGES",
  },
  INVALID_FOLDER_FORMAT: {
    message: "Invalid folder format",
    statusCode: 400,
    code: "INVALID_FOLDER_FORMAT",
  },
  INVALID_URL: {
    message: "Invalid url format",
    statusCode: 400,
    code: "INVALID_URL",
  },
  INVALID_INPUT: {
    message: "Number of publicIds must match number of buffers",
    statusCode: 400,
    code: "INVALID_INPUT",
  },

  //place
  PLACE_NOT_FOUND: {
    message: "Place not found",
    statusCode: 404,
    code: "PLACE_NOT_FOUND",
  },

  //tour
  TOUR_NOT_FOUND: {
    message: "Tour not found",
    statusCode: 404,
    code: "TOUR_NOT_FOUND",
  },

  INVALID_TOUR_TIME: {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    statusCode: 400,
    code: "INVALID_TOUR_TIME",
  },

  //facility
  FACILITY_NOT_FOUND: {
    message: "Facility not found",
    statusCode: 404,
    code: "FACILITY_NOT_FOUND",
  },
  IMAGE_OR_URL_REQUIRED: {
    message: "Image file or url is required",
    statusCode: 400,
    code: "IMAGE_OR_URL_REQUIRED",
  },

  // ticket
  TICKET_NOT_FOUND: {
    statusCode: 404,
    message: "Ticket not found",
    code: "TICKET_NOT_FOUND",
  },
  TICKET_CREATE_FAILED: {
    statusCode: 500,
    message: "Failed to create ticket",
    code: "TICKET_CREATE_FAILED",
  },
  TICKET_UPDATE_FAILED: {
    statusCode: 500,
    message: "Failed to update ticket",
    code: "TICKET_UPDATE_FAILED",
  },
  TICKET_DELETE_FAILED: {
    statusCode: 500,
    message: "Failed to delete ticket",
    code: "TICKET_DELETE_FAILED",
  },

  // room
  ROOM_NOT_FOUND: {
    statusCode: 404,
    message: "Không tìm thấy phòng",
    code: "ROOM_NOT_FOUND",
  },

  // cart
  CART_NOT_FOUND: {
    message: "Cart not found",
    statusCode: 404,
    code: "CART_NOT_FOUND",
  },
  CART_ITEM_NOT_FOUND: {
    message: "Cart item not found",
    statusCode: 404,
    code: "CART_ITEM_NOT_FOUND",
  },
  INVALID_CART_ITEM: {
    message: "Invalid cart item data",
    statusCode: 400,
    code: "INVALID_CART_ITEM",
  },

  BOOKING_NOT_FOUND: {
    message: "Booking not found",
    statusCode: 404,
    code: "BOOKING_NOT_FOUND",
  },
  CART_EMPTY: {
    message: "Your cart is empty",
    statusCode: 400,
    code: "CART_EMPTY",
  },
  INVALID_VOUCHER: {
    message: "Invalid or expired voucher code",
    statusCode: 400,
    code: "INVALID_VOUCHER",
  },
  VOUCHER_LIMIT_EXCEEDED: {
    message: "This voucher has reached its usage limit",
    statusCode: 400,
    code: "VOUCHER_LIMIT_EXCEEDED",
  },
  CANNOT_CANCEL_BOOKING: {
    message: "Cannot cancel booking in current status",
    statusCode: 400,
    code: "CANNOT_CANCEL_BOOKING",
  },
  BOOKING_FINALIZED: {
    message: "Booking has been finalized and cannot be modified",
    statusCode: 400,
    code: "BOOKING_FINALIZED",
  },
  INVALID_STATUS_TRANSITION: {
    message: "Invalid booking status transition",
    statusCode: 400,
    code: "INVALID_STATUS_TRANSITION",
  },

  // authorize
  UNAUTHORIZED: {
    statusCode: 401,
    message: "Không được phép truy cập",
    code: "UNAUTHORIZED",
  },

  // missing dates
  MISSING_DATES: {
    statusCode: 400,
    message: "Thiếu checkin hoặc checkout",
    code: "MISSING_DATES",
  },

  // Payment errors
  PAYMENT_NOT_FOUND: {
    code: "PAYMENT_NOT_FOUND",
    message: "Không tìm thấy payment",
  },
  INVALID_PAYMENT_METHOD: {
    code: "INVALID_PAYMENT_METHOD",
    message: "Phương thức thanh toán không hợp lệ",
  },

  // Booking errors
  ROOM_UNAVAILABLE: {
    code: "ROOM_UNAVAILABLE",
    message: "Phòng không còn trống cho ngày đã chọn",
  },
  TOUR_FULL: {
    code: "TOUR_FULL",
    message: "Tour đã đầy chỗ",
  },
  TICKET_UNAVAILABLE: {
    code: "TICKET_UNAVAILABLE",
    message: "Vé không đủ số lượng",
  },
  INVALID_DATES: {
    code: "INVALID_DATES",
    message: "Ngày không hợp lệ",
  },
  PAST_DATE: {
    code: "PAST_DATE",
    message: "Không thể đặt cho ngày trong quá khứ",
  },
  // notification
  NOTIFICATION_NOT_FOUND: {
    message: "Không tìm thấy thông báo",
    statusCode: 404,
    code: "BOOKING_NOT_FOUND",
  },

  // report
  REPORT_NOT_FOUND: {
    message: "Không tìm thấy tố cáo",
    statusCode: 404,
    code: "REPORT_NOT_FOUND",
  },

  // review
  REVIEW_FORBIDDEN: {
    message: "Bạn không có quyền sửa đánh giá này",
    statusCode: 403,
    code: "FORBIDDEN",
  },
};

module.exports = { ERROR_CODES };
