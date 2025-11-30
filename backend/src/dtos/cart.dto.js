class CartItemDTO {
  constructor(item) {
    this.id = item.id;
    this.itemType = item.item_type;
    this.itemId = item.item_id;
    this.quantity = item.quantity;
    this.checkinDate = item.checkin_date;
    this.checkoutDate = item.checkout_date;
    this.visitDate = item.visit_date;
    this.note = item.note;
    this.price = item.price;
    this.total = item.total;
    this.details = item.details;
  }

  static itemFromModel(item) {
    return new CartItemDTO(item);
  }

  static itemListFromModel(items) {
    return items.map((i) => CartItemDTO.itemFromModel(i));
  }
}

class CartDTO {
  constructor(cart) {
    this.id = cart.id;
    this.items = CartItemDTO.itemListFromModel(cart.items);
    this.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    this.totalAmount = cart.items.reduce((sum, i) => sum + i.total, 0);
  }

  static fromModel(cart) {
    return new CartDTO(cart);
  }
}

module.exports = { CartDTO, CartItemDTO };
