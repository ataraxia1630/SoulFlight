const CloudinaryService = require("../services/cloudinary.service");

class ImageResponseDTO {
  constructor(result) {
    this.public_id = result.public_id;
    this.url = result.secure_url;
    this.generated_url = CloudinaryService.generateUrl(result.public_id);
    this.format = result.format;
    this.width = result.width;
    this.height = result.height;
    this.size = result.bytes;
    this.created_at = result.created_at;
  }
}

class MultipleImagesResponseDTO {
  constructor(results) {
    this.count = results.length;
    this.images = results.map((result) => new ImageResponseDTO(result));
  }
}

module.exports = {
  ImageResponseDTO,
  MultipleImagesResponseDTO,
};
