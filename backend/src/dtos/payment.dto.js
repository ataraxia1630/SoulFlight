class PaymentDTO {
  constructor(payment) {
    this.id = payment.id;
    this.amount = Number(payment.amount);
    this.method = payment.method;
    this.status = payment.status;
    this.transactionId = payment.transaction_id;
    this.paidAt = payment.paid_at;
    this.paymentUrl = payment.paymentUrl;
    this.bookings = payment.bookings
      ? payment.bookings.map((b) => ({
          id: b.id,
          finalAmount: Number(b.final_amount),
          status: b.status,
          provider: b.provider
            ? {
                id: b.provider.id,
                name: b.provider.user?.name,
              }
            : null,
        }))
      : [];
    this.createdAt = payment.created_at;
    this.updatedAt = payment.updated_at;
  }

  static fromModel(payment) {
    return new PaymentDTO(payment);
  }

  static fromList(payments) {
    return payments.map((p) => new PaymentDTO(p));
  }
}

module.exports = { PaymentDTO };
