class ProviderDTO {
  constructor(provider) {
    this.id = provider.id;
    this.name = provider.name;
    this.email = provider.email;
    this.phone = provider.phone;
    // Add other relevant fields as necessary
  }
  static fromModel(provider) {
    return new ProviderDTO(provider);
  }
  static fromList(providers) {
    return providers.map((p) => new ProviderDTO(p));
  }
}

module.exports = { ProviderDTO };
