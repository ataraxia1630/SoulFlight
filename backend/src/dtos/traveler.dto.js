class TravelerDTO {
  constructor(traveler) {
    this.id = traveler.id;
    this.name = traveler.name;
    this.email = traveler.email;
    this.phone = traveler.phone;
    // Add other relevant fields as necessary
  }
  static fromModel(traveler) {
    return new TravelerDTO(traveler);
  }
  static fromList(travelers) {
    return travelers.map((t) => new TravelerDTO(t));
  }
}

module.exports = { TravelerDTO };
