const CloudinaryService = require("../services/cloudinary.service");

class MenuDTO {
  constructor(menu) {
    this.id = menu.id;
    this.name = menu.name;
    this.description = menu.description || null;
    this.cover_url = menu.cover_url ? CloudinaryService.generateUrl(menu.cover_url) : null;
    this.cover_thumbnail = menu.cover_url
      ? CloudinaryService.generateUrl(menu.cover_url, {
          width: 400,
          height: 300,
          crop: "fill",
        })
      : null;
    this.service_id = menu.service_id;
    this.service_name = menu.Service?.name || null;

    this.provider_name = menu.Service?.Provider?.user?.name || null;

    // Menu_item
    this.items = (menu.MenuItems || []).map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || null,
      price: parseFloat(item.price),
      unit: item.unit,
      status: item.status,
      image_url: item.image_url ? CloudinaryService.generateUrl(item.image_url) : null,
      image_thumbnail: item.image_url
        ? CloudinaryService.generateUrl(item.image_url, {
            width: 400,
            height: 300,
            crop: "fill",
          })
        : null,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    this.created_at = menu.created_at;
    this.updated_at = menu.updated_at;
  }

  static fromModel(menu) {
    return new MenuDTO(menu);
  }

  static fromList(menus) {
    return menus.map((m) => new MenuDTO(m));
  }
}

module.exports = { MenuDTO };
