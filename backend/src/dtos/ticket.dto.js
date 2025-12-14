const CloudinaryService = require("../services/cloudinary.service");

class TicketDTO {
  constructor(ticket) {
    this.id = ticket.id;
    this.name = ticket.name;
    this.description = ticket.description || null;
    this.price = parseFloat(ticket.price);
    this.status = ticket.status;
    this.service_id = ticket.service_id;
    this.service_name = ticket.Service?.name || null;
    this.place_id = ticket.place_id;

    this.place = ticket.Place
      ? {
          id: ticket.Place.id,
          name: ticket.Place.name,
          description: ticket.Place.description || null,
          address: ticket.Place.address || null,
          opening_hours: ticket.Place.opening_hours || null,
          entry_fee: ticket.Place.entry_fee ? parseFloat(ticket.Place.entry_fee) : null,
          main_image: ticket.Place.images?.find((i) => i.is_main)?.url
            ? CloudinaryService.generateUrl(ticket.Place.images.find((i) => i.is_main).url)
            : ticket.Place.images?.[0]?.url
              ? CloudinaryService.generateUrl(ticket.Place.images[0].url)
              : null,
        }
      : null;

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
