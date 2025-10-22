class TicketDTO {
  constructor(ticket) {
    this.id = ticket.id;
    this.name = ticket.name;
    this.description = ticket.description;
    this.price = ticket.price;
    this.service_id = ticket.service_id;
    this.place_id = ticket.place_id;
    this.created_at = ticket.created_at;
    this.updated_at = ticket.updated_at;
  }

  static fromModel(ticket) {
    return new TicketDTO(ticket);
  }

  static fromList(tickets) {
    return tickets.map((t) => new TicketDTO(t));
  }
}

module.exports = { TicketDTO };
