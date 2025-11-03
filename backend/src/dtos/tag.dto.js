class ServiceTagDTO {
  constructor(tag) {
    this.id = tag.id;
    this.name = tag.name;
  }

  static fromModel(tag) {
    return new ServiceTagDTO(tag);
  }

  static fromList(tags) {
    return tags.map((tag) => ServiceTagDTO.fromModel(tag));
  }
}

module.exports = { ServiceTagDTO };
