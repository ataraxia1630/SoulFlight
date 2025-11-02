const { FacilityDTO } = require("./facility.dto");
const { ImageDTO } = require("./cloudinary.dto");
const CloudinaryService = require("../services/cloudinary.service");

class RoomDTO {
  constructor(room) {
    this.id = room.id;
    this.name = room.name;
    this.description = room.description;
    this.price_per_night = room.price_per_night;
    this.max_children_number = room.max_children_number;
    this.max_adult_number = room.max_adult_number;
    this.pet_allowed = room.pet_allowed;
    this.bed_number = room.bed_number;
    this.service_id = room.service_id;
    this.facilities = room.facilities.map((rf) => FacilityDTO.fromModel(rf.facility));

    this.images = room.images.map((img) => {
      const dto = new ImageDTO({
        public_id: img.url,
        secure_url: CloudinaryService.generateUrl(img.url),
        generated_url: CloudinaryService.generateUrl(img.url),
        format: "jpg",
        width: 800,
        height: 600,
        bytes: 0,
        created_at: img.created_at,
      });
      dto.thumbnail_url = CloudinaryService.generateUrl(img.url, {
        width: 300,
        height: 200,
      });
      dto.position = img.position;
      dto.is_main = img.is_main;
      dto.id = img.id;
      return dto;
    });

    this.created_at = room.created_at;
    this.updated_at = room.updated_at;
  }

  static fromModel(room) {
    return new RoomDTO(room);
  }

  static fromList(rooms) {
    return rooms.map((r) => new RoomDTO(r));
  }
}

module.exports = { RoomDTO };
