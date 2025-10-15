class TourDTO {
  constructor(tour) {
    this.id = tour.id;
    this.name = tour.name;
    this.description = tour.description;
    this.service_price = tour.service_price;
    this.duration = tour.duration;
    this.service_id = tour.service_id;
    this.tourguide_id = tour.tourguide_id;
    this.is_recurring = tour.is_recurring;
    this.repeat_rule = tour.repeat_rule;
    this.repeat_days = tour.repeat_days;
    this.start_date = tour.start_date;
    this.end_date = tour.end_date;
    this.status = tour.status;
    this.places = tour.TourPlace
      ? tour.TourPlace.map((tp) => ({
          place_id: tp.place_id,
          description: tp.description,
          start_time: tp.start_time,
          end_time: tp.end_time,
        }))
      : [];
  }

  static fromModel(tour) {
    return new TourDTO(tour);
  }

  static fromList(tours) {
    return tours.map((t) => new TourDTO(t));
  }
}

module.exports = { TourDTO };
