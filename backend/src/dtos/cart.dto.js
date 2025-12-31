class CartItemDTO {
  constructor(item) {
    this.id = item.id;
    this.itemType = item.itemType || item.item_type;
    this.itemId = item.itemId || item.item_id;
    this.itemName = item.itemName;
    this.quantity = item.quantity;
    this.price = item.price;
    this.total = item.total;
    this.checkinDate = item.checkin_date;
    this.checkoutDate = item.checkout_date;
    this.visitDate = item.visit_date;
    this.note = item.note;
  }

  static itemFromModel(item) {
    return new CartItemDTO(item);
  }

  static itemListFromModel(items) {
    return items.map((i) => new CartItemDTO(i));
  }
}

class CartDTO {
  constructor(cart) {
    this.id = cart.id;
    this.traveler_id = cart.traveler_id;

    this.services = (cart.services || []).map((s) => ({
      serviceId: s.serviceId,
      serviceName: s.serviceName,
      serviceTotal: s.serviceTotal,
      items: CartItemDTO.itemListFromModel(s.items),
    }));

    this.totalItems = (cart.services || []).reduce(
      (sum, s) => sum + s.items.reduce((iSum, item) => iSum + item.quantity, 0),
      0,
    );
    this.totalAmount = (cart.services || []).reduce((sum, s) => sum + s.serviceTotal, 0);
  }

  static fromModel(cart) {
    return new CartDTO(cart);
  }
}

module.exports = { CartDTO, CartItemDTO };
