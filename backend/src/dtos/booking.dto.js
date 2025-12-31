class BookingItemDTO {
  constructor(item) {
    this.id = item.id;
    this.type = item.item_type;
    this.name = item.details?.name || item.itemName || "Dịch vụ";
    this.quantity = item.quantity;
    this.unitPrice = parseFloat(item.unit_price) || parseFloat(item.unitPrice);
    this.totalPrice = parseFloat(item.total_price) || parseFloat(item.totalAmount);
    this.checkinDate = item.checkin_date;
    this.checkoutDate = item.checkout_date;
    this.visitDate = item.visit_date;
    this.image = item.details?.image || null;
    this.serviceId = item.details?.service_id || null;
  }

  static fromModel(item) {
    return new BookingItemDTO(item);
  }
}

class BookingDTO {
  constructor(booking) {
    this.id = booking.id;
    this.status = booking.status;
    this.totalAmount = parseFloat(booking.total_amount);
    this.discountAmount = parseFloat(booking.discount_amount);
    this.finalAmount = parseFloat(booking.final_amount);
    this.voucherCode = booking.voucher?.code || null;
    this.bookingDate = booking.booking_date;
    this.providerName = booking.provider?.user?.name || "Unknown";
    this.serviceId = booking.service_id;
    this.serviceName = booking.service?.name || null;
    this.expiryTime = booking.expiry_time;
    this.items = booking.items?.map(BookingItemDTO.fromModel) || [];
    this.paymentStatus = booking.payment?.status || booking.payments?.[0]?.status || null;
    this.paymentId = booking.payment?.id || booking.payments?.[0]?.id || null;
    this.notes = booking.notes;
    this.createdAt = booking.created_at;
    this.updatedAt = booking.updated_at;
  }

  static fromModel(booking) {
    return new BookingDTO(booking);
  }

  static fromList(bookings) {
    return bookings.map((booking) => new BookingDTO(booking));
  }
}

module.exports = { BookingDTO };
