class ServiceTypeDTO {
  constructor(type) {
    this.id = type.id;
    this.name = type.name;
    this.description = type.description;
  }

  static fromModel(type) {
    return new ServiceTypeDTO(type);
  }

  static fromList(types) {
    return types.map((type) => ServiceTypeDTO.fromModel(type));
  }
}

module.exports = { ServiceTypeDTO };
