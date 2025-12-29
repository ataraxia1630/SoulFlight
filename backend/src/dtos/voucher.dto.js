class VoucherDTO {
  constructor(voucher) {
    const now = new Date();
    let status = "active";

    if (voucher.valid_from && new Date(voucher.valid_from) > now) {
      status = "upcoming";
    } else if (voucher.valid_to && new Date(voucher.valid_to) < now) {
      status = "expired";
    } else if (voucher.max_uses && voucher.used_count >= voucher.max_uses) {
      status = "exhausted";
    }

    this.id = voucher.id;
    this.title = voucher.title;
    this.code = voucher.code;
    this.discountPercent = voucher.discount_percent;
    this.description = voucher.description;
    this.validFrom = voucher.valid_from;
    this.validTo = voucher.valid_to;
    this.isGlobal = voucher.is_global;
    this.maxUses = voucher.max_uses;
    this.usedCount = voucher.used_count;
    this.remainingUses = voucher.max_uses ? voucher.max_uses - voucher.used_count : null;
    this.status = status;
    this.service = voucher.service
      ? {
          id: voucher.service.id,
          name: voucher.service.name,
          typeId: voucher.service.type_id,
        }
      : null;
    this.bookingsCount = voucher._count?.bookings || 0;
    this.createdAt = voucher.created_at;
  }

  static fromModel(voucher) {
    return new VoucherDTO(voucher);
  }

  static fromList(vouchers) {
    return vouchers.map((v) => VoucherDTO.fromModel(v));
  }
}

module.exports = { VoucherDTO };
