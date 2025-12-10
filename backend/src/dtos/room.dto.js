const { FacilityDTO } = require("./facility.dto");
const CloudinaryService = require("../services/cloudinary.service");

class RoomDTO {
  constructor(room) {
    this.id = room.id;
    this.name = room.name;
    this.description = room.description || null;
    this.price_per_night = room.price_per_night ? parseFloat(room.price_per_night) : 0;
    this.total_rooms = room.total_rooms ?? 1;
    this.max_children_number = room.max_children_number ?? null;
    this.max_adult_number = room.max_adult_number ?? null;
    this.pet_allowed = room.pet_allowed;
    this.bed_number = room.bed_number;
    this.size_sqm = room.size_sqm ? parseFloat(room.size_sqm) : null;
    this.view_type = room.view_type || null;
    this.status = room.status;

    this.service_id = room.service_id;
    this.service_name = room.service_name;

    this.facilities = room.facilities.map((rf) => FacilityDTO.fromModel(rf.facility));

    const images = (room.images || []).map((img) => ({
      id: img.id,
      public_id: img.url,
      url: CloudinaryService.generateUrl(img.url),
      thumbnail_url: CloudinaryService.generateUrl(img.url, {
        width: 400,
        height: 300,
        crop: "fill",
      }),
      position: img.position,
      is_main: img.is_main,
      created_at: img.created_at,
    }));

    this.images = images.sort((a, b) => {
      if (a.is_main && !b.is_main) return -1;
      if (!a.is_main && b.is_main) return 1;
      return a.position - b.position;
    });

    this.main_image = this.images.find((img) => img.is_main)?.url || this.images[0]?.url || null;
    this.thumbnail =
      this.images.find((img) => img.is_main)?.thumbnail_url ||
      this.images[0]?.thumbnail_url ||
      null;

    this.created_at = room.created_at;
    this.updated_at = room.updated_at;
  }

  static fromModel(room) {
    return new RoomDTO(room);
  }

  static fromList(rooms) {
    return rooms.map((room) => new RoomDTO(room));
  }

  static withAvailability(room, availabilityData) {
    const dto = new RoomDTO(room);

    const basePrice = dto.price_per_night;

    dto.availability = {
      available: availabilityData.available,
      available_count: availabilityData.available_count,
      required_quantity: availabilityData.required_quantity || 1,
      nights: availabilityData.nights,
      total_price: availabilityData.dates.reduce((sum, d) => {
        const price = d.price_override !== null ? d.price_override : basePrice;
        return sum + price;
      }, 0),
      date_range: availabilityData.dates.map((d) => ({
        date: d.date,
        available: d.available,
        price: d.price_override !== null ? d.price_override : basePrice,
        is_override: d.price_override !== null,
      })),
    };

    return dto;
  }
}

module.exports = { RoomDTO };
