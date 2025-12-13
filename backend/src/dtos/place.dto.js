const CloudinaryService = require("../services/cloudinary.service");

class PlaceDTO {
  constructor(place) {
    this.id = place.id;
    this.name = place.name;
    this.description = place.description || null;
    this.address = place.address || null;
    this.opening_hours = place.opening_hours || null;
    this.entry_fee = place.entry_fee ? parseFloat(place.entry_fee) : null;

    const images = (place.images || [])
      .map((img) => ({
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
      }))
      .sort((a, b) => {
        if (a.is_main && !b.is_main) return -1;
        if (!a.is_main && b.is_main) return 1;
        return a.position - b.position;
      });

    this.images = images;
    this.main_image = images.find((i) => i.is_main)?.url || images[0]?.url || null;
    this.thumbnail =
      images.find((i) => i.is_main)?.thumbnail_url || images[0]?.thumbnail_url || null;

    this.created_at = place.created_at;
    this.updated_at = place.updated_at;
  }

  static fromModel(place) {
    return new PlaceDTO(place);
  }

  static fromList(places) {
    return places.map((p) => new PlaceDTO(p));
  }
}

module.exports = { PlaceDTO };
