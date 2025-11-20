const CloudinaryService = require("../services/cloudinary.service");

class TravelerDTO {
  constructor(traveler, user) {
    this.id = traveler.id;
    this.gender = traveler.gender;
    this.dob = traveler.dob;
    this.location = traveler.location;
    this.avatar_url = traveler.avatar_url
      ? CloudinaryService.generateUrl(traveler.avatar_url)
      : null;
    this.created_at = traveler.created_at;
    this.updated_at = traveler.updated_at;

    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    this.phone = user.phone;
    this.status = user.status;
  }

  static fromModel(traveler, user) {
    return new TravelerDTO(traveler, user);
  }

  static fromList(list) {
    return list
      .map((user) => {
        const traveler = user.Traveler[0];
        if (!traveler) return null;
        return new TravelerDTO(traveler, user);
      })
      .filter(Boolean);
  }
}

module.exports = { TravelerDTO };
