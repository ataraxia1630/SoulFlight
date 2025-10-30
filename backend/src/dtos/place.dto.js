class PlaceDTO {
  constructor(place) {
    this.id = place.id;
    this.name = place.name;
    this.description = place.description;
    this.address = place.address;
    this.image_url = place.image_url;
    this.opening_hour = place.opening_hour;
    this.closing_hour = place.closing_hour;
    // contact_info could be an object with phone, email, website, etc.
  }

  static fromModel(place) {
    return new PlaceDTO(place);
  }

  static fromList(places) {
    return places.map((p) => new PlaceDTO(p));
  }
}

module.exports = { PlaceDTO };
