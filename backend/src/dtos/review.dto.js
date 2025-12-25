const CloudinaryService = require("../services/cloudinary.service");

class ReviewDTO {
  constructor(review) {
    this.id = review.id;
    this.rating = review.rating;
    this.comment = review.comment;
    this.created_at = review.created_at;

    const traveler = review.traveler || {};
    this.traveler = {
      id: review.traveler_id,
      name: traveler.user?.name || "Khách hàng",
      avatar_url: traveler.avatar_url ? CloudinaryService.generateUrl(traveler.avatar_url) : null,
    };

    this.target = {
      service_id: review.service_id,
      service_name: review.service?.name,
    };

    if (review.room) this.target.room = { id: review.room.id, name: review.room.name };
    if (review.tour) this.target.tour = { id: review.tour.id, name: review.tour.name };
    if (review.ticket) this.target.ticket = { id: review.ticket.id, name: review.ticket.name };
    if (review.menu) this.target.menu = { id: review.menu.id, name: review.menu.name };
  }

  static fromModel(review) {
    return new ReviewDTO(review);
  }

  static fromList(reviews) {
    return reviews.map((r) => new ReviewDTO(r));
  }
}

module.exports = { ReviewDTO };
