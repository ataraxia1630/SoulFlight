const { BookingService } = require("../services/booking.service");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");
const { BookingDTO } = require("../dtos/booking.dto");

// ========== TRAVELER ==========
const BookingController = {
  getMyBookings: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const result = await BookingService.getBookingsByTraveler(travelerId, {
      page: Number(page),
      limit: Number(limit),
      status,
    });

    res.status(200).json(
      ApiResponse.success({
        bookings: BookingDTO.fromList(result.bookings),
        pagination: result.pagination,
      }),
    );
  }),

  getBookingDetail: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const { bookingId } = req.params;

    const booking = await BookingService.getBookingDetail(travelerId, bookingId);
    res.status(200).json(ApiResponse.success(BookingDTO.fromModel(booking)));
  }),

  updateBookingInfo: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const { bookingId } = req.params;
    const { notes, voucherCode } = req.body;

    const updatedBooking = await BookingService.updateBookingInfo(travelerId, bookingId, {
      notes,
      voucherCode,
    });

    res.status(200).json(
      ApiResponse.success({
        data: BookingDTO.fromModel(updatedBooking),
        message: "Cập nhật thông tin booking thành công",
      }),
    );
  }),

  createFromCart: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const { vouchers = {}, voucherCode } = req.body;

    let voucherMap = {};
    if (voucherCode) {
      voucherMap = null;
    } else if (Object.keys(vouchers).length > 0) {
      voucherMap = vouchers;
    }

    const booking = await BookingService.createBookingFromCart(travelerId, voucherMap);

    res.status(201).json(
      ApiResponse.success({
        message: "Booking created successfully",
        booking: BookingDTO.fromModel(booking),
      }),
    );
  }),

  cancelBooking: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const { bookingId } = req.params;
    const { reason } = req.body;

    await BookingService.cancelBooking(travelerId, bookingId, reason);
    res.status(200).json(ApiResponse.success({ message: "Booking cancelled successfully" }));
  }),

  createRoomBooking: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const booking = await BookingService.createRoomBooking(travelerId, req.body);

    res.status(201).json(
      ApiResponse.success({
        message: "Đặt phòng thành công",
        booking: BookingDTO.fromModel(booking),
      }),
    );
  }),

  createTourBooking: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const booking = await BookingService.createTourBooking(travelerId, req.body);

    res.status(201).json(
      ApiResponse.success({
        message: "Đặt tour thành công",
        booking: BookingDTO.fromModel(booking),
      }),
    );
  }),

  createTicketBooking: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const booking = await BookingService.createTicketBooking(travelerId, req.body);

    res.status(201).json(
      ApiResponse.success({
        message: "Đặt vé thành công",
        booking: BookingDTO.fromModel(booking),
      }),
    );
  }),

  createMenuBooking: catchAsync(async (req, res) => {
    const travelerId = req.user.id;
    const booking = await BookingService.createMenuBooking(travelerId, req.body);

    res.status(201).json(
      ApiResponse.success({
        message: "Đặt món thành công",
        booking: BookingDTO.fromModel(booking),
      }),
    );
  }),
};

// ========== PROVIDER ==========
const ProviderBookingController = {
  getProviderBookings: catchAsync(async (req, res) => {
    const providerId = req.user.id;

    const { page = 1, limit = 10, status, from, to } = req.query;
    const result = await BookingService.getBookingsByProvider(providerId, {
      page: Number(page),
      limit: Number(limit),
      status,
      from,
      to,
    });

    res.json(ApiResponse.success(result));
  }),

  getProviderBookingDetail: catchAsync(async (req, res) => {
    const providerId = req.user.id;
    const booking = await BookingService.getBookingForProvider(providerId, req.params.bookingId);
    res.json(ApiResponse.success(BookingDTO.fromModel(booking)));
  }),

  updateBookingStatus: catchAsync(async (req, res) => {
    const providerId = req.user.id;
    const { bookingId } = req.params;
    const { status, note } = req.body;

    const booking = await BookingService.providerUpdateStatus(providerId, bookingId, status, note);
    res.json(
      ApiResponse.success({
        message: "Booking status updated",
        booking: BookingDTO.fromModel(booking),
      }),
    );
  }),
};

// ========== ADMIN ==========
const AdminBookingController = {
  getAllBookings: catchAsync(async (req, res) => {
    const filters = req.query;
    const result = await BookingService.getAllBookingsAdmin(filters);
    res.json(ApiResponse.success(result));
  }),

  getBookingDetail: catchAsync(async (req, res) => {
    const booking = await BookingService.getBookingDetailAdmin(req.params.bookingId);
    res.json(ApiResponse.success(BookingDTO.fromModel(booking)));
  }),

  forceUpdateStatus: catchAsync(async (req, res) => {
    const { status, note } = req.body;
    const booking = await BookingService.adminForceUpdateStatus(req.params.bookingId, status, note);
    res.json(ApiResponse.success({ message: "Status forced updated", booking }));
  }),
};

module.exports = {
  BookingController,
  ProviderBookingController,
  AdminBookingController,
};
