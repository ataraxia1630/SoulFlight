const CloudinaryService = require("../services/cloudinary.service");

class TourDTO {
  constructor(tour) {
    this.id = tour.id;
    this.name = tour.name;
    this.description = tour.description || null;
    this.service_price = parseFloat(tour.service_price);
    this.total_price = parseFloat(tour.total_price);
    this.start_time = tour.start_time;
    this.end_time = tour.end_time;
    this.duration_hours = Math.round(
      (new Date(tour.end_time) - new Date(tour.start_time)) / (1000 * 60 * 60),
    );
    this.max_participants = tour.max_participants;
    this.current_bookings = tour.current_bookings;
    this.available_slots = tour.max_participants - tour.current_bookings;
    this.status = tour.status;
    this.service_id = tour.service_id;
    this.service_name = tour.Service?.name || null;

    this.tourguide = tour.TourGuide
      ? {
          id: tour.TourGuide.id,
          name: tour.TourGuide.name,
          phone: tour.TourGuide.phone,
          image_url: tour.TourGuide.image_url
            ? CloudinaryService.generateUrl(tour.TourGuide.image_url)
            : null,
        }
      : null;

    this.places = (tour.TourPlace || []).map((tp) => {
      const place = tp.Place;
      const images = (place.images || [])
        .map((img) => ({
          id: img.id,
          url: CloudinaryService.generateUrl(img.url),
          thumbnail_url: CloudinaryService.generateUrl(img.url, {
            width: 400,
            height: 300,
            crop: "fill",
          }),
          public_id: img.url,
          is_main: img.is_main,
          position: img.position,
        }))
        .sort((a, b) => (a.is_main ? -1 : b.is_main ? 1 : a.position - b.position));

      return {
        place_id: place.id,
        name: place.name,
        description: tp.description || place.description || null,
        address: place.address || null,
        start_time: tp.start_time || null,
        end_time: tp.end_time || null,
        images,
        main_image: images.find((i) => i.is_main)?.url || images[0]?.url || null,
        thumbnail: images.find((i) => i.is_main)?.thumbnail_url || images[0]?.thumbnail_url || null,
      };
    });

    // Ảnh tổng của tour là tổng hợp từ tất cả place
    const allImages = this.places.flatMap((p) => p.images);
    this.images = allImages.sort((a, b) =>
      a.is_main ? -1 : b.is_main ? 1 : a.position - b.position,
    );
    this.main_image = this.images.find((i) => i.is_main)?.url || this.images[0]?.url || null;
    this.thumbnail =
      this.images.find((i) => i.is_main)?.thumbnail_url || this.images[0]?.thumbnail_url || null;

    this.created_at = tour.created_at;
    this.updated_at = tour.updated_at;
  }

  static fromModel(tour) {
    return new TourDTO(tour);
  }

  static fromList(tours) {
    return tours.map((t) => new TourDTO(t));
  }
}

module.exports = { TourDTO };
