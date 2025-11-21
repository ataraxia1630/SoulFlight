const CloudinaryService = require("../services/cloudinary.service");

class ProviderDTO {
  constructor(provider, user) {
    this.id = provider.id;
    this.description = provider.description;
    this.logo_url = provider.logo_url ? CloudinaryService.generateUrl(provider.logo_url) : null;
    this.website_link = provider.website_link;
    this.address = provider.address;
    this.id_card = provider.id_card;
    this.province = provider.province;
    this.country = provider.country;
    this.establish_year = provider.establish_year;
    this.created_at = provider.created_at;
    this.updated_at = provider.updated_at;

    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    this.phone = user.phone;
    this.status = user.status;
  }

  static fromModel(provider, user) {
    return new ProviderDTO(provider, user);
  }

  static fromList(list) {
    return list
      .map((user) => {
        const provider = user.Provider[0];
        if (!provider) return null;
        return new ProviderDTO(provider, user);
      })
      .filter(Boolean);
  }
}

module.exports = { ProviderDTO };
