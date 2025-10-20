const CloudinaryService = require("../services/cloudinary.service");

class FacilityDTO {
  constructor(facility) {
    this.id = facility.id;
    this.name = facility.name;
    this.icon_url = facility.icon_url
      ? CloudinaryService.generateUrl(facility.icon_url, {
          width: 100,
          height: 100,
        })
      : null;
    this.icon_public_id = facility.icon_url;
    this.created_at = facility.created_at;
    this.updated_at = facility.updated_at;
  }

  static fromModel(facility) {
    return new FacilityDTO(facility);
  }

  static fromList(facilities) {
    return facilities.map((f) => new FacilityDTO(f));
  }
}

module.exports = { FacilityDTO };
