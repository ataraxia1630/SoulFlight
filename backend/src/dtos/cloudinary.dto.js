class ImageDTO {
  constructor(image) {
    this.public_id = image.public_id;
    this.url = image.secure_url;
    this.generated_url = image.generated_url || image.secure_url;
    this.format = image.format;
    this.width = image.width;
    this.height = image.height;
    this.size = image.bytes;
    this.created_at = image.created_at;
  }

  static fromModel(image) {
    return new ImageDTO(image);
  }

  static fromList(images) {
    return images.map((img) => new ImageDTO(img));
  }
}

class MultipleImagesDTO {
  constructor(images) {
    this.count = images.length;
    this.images = ImageDTO.fromList(images);
  }
}

module.exports = { ImageDTO, MultipleImagesDTO };
