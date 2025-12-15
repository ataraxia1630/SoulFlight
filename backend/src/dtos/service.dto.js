const CloudinaryService = require("../services/cloudinary.service");

class ServiceDTO {
  constructor(service) {
    this.id = service.id;
    this.name = service.name;
    this.description = service.description;
    this.location = service.location;
    this.rating = service.rating;
    this.price_min = service.price_min;
    this.price_max = service.price_max;
    this.status = service.status;
    this.created_at = service.created_at;
    this.updated_at = service.updated_at;

    // Provider info
    if (service.Provider?.user) {
      const provider = service.Provider;
      const providerUser = provider.user;
      this.provider = {
        id: provider.id,
        description: provider.description,
        logo_url: provider.logo_url ? CloudinaryService.generateUrl(provider.logo_url) : null,
        website_link: provider.website_link,
        address: provider.address,
        id_card: provider.id_card,
        province: provider.province,
        country: provider.country,
        establish_year: provider.establish_year,
        name: providerUser.name,
        username: providerUser.username,
        email: providerUser.email,
        phone: providerUser.phone,
        status: providerUser.status,
      };
    } else {
      this.provider = null;
    }

    if (service.Type) {
      this.type = {
        id: service.Type.id,
        name: service.Type.name,
        description: service.Type.description,
      };
    } else {
      this.type = null;
    }
  }

  static fromModel(service) {
    return new ServiceDTO(service);
  }

  static fromList(list) {
    return list.map((item) => (item.Provider?.user ? new ServiceDTO(item) : null)).filter(Boolean);
  }
}

module.exports = { ServiceDTO };
