class BookingItemDTO {
  constructor(item) {
    this.id = item.id;
    this.type = item.item_type;
    this.name = item.details?.name || "Unknown";
    this.quantity = item.quantity;
    this.unitPrice = Number(item.unit_price);
    this.totalPrice = Number(item.total_price);
    this.checkinDate = item.checkin_date;
    this.checkoutDate = item.checkout_date;
    this.visitDate = item.visit_date;
    this.image = item.details?.image || null;
  }

  static fromModel(item) {
    return new BookingItemDTO(item);
  }
}

class BookingDTO {
  constructor(booking) {
    this.id = booking.id;
    this.status = booking.status;
    this.totalAmount = Number(booking.total_amount);
    this.discountAmount = Number(booking.discount_amount);
    this.finalAmount = Number(booking.final_amount);
    this.voucherCode = booking.voucher?.code || null;
    this.bookingDate = booking.booking_date;
    this.providerName =
      booking.provider?.user?.name || booking.provider?.name || "Unknown Provider";
    this.items = booking.items?.map(BookingItemDTO.fromModel) || [];
    this.paymentStatus =
      booking.payment?.status ||
      (booking.payments && booking.payments.length > 0 ? booking.payments[0].status : null);

    this.paymentId =
      booking.payment?.id ||
      (booking.payments && booking.payments.length > 0 ? booking.payments[0].id : null);
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
