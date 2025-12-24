const { pickImage } = require("../utils/pickImage");

const formatPrice = (price, currency = "VND", locale = "vi-VN") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(price);

function SearchServiceDTO(services, travelerId = null) {
  return Promise.all(
    services.map(async (s) => ({
      id: s.id,
      name: s.name,
      description: s.description || "",
      location: s.location || "",
      rating: s.rating,
      type: s.Type?.name || "",
      is_wishlisted: travelerId ? s.Wishlists && s.Wishlists.length > 0 : false,
      provider: {
        name: s.Provider?.user?.name || `Provider ${s.provider_id}`,
      },
      price_range:
        s.price_min && s.price_max
          ? `${formatPrice(s.price_min)} - ${formatPrice(s.price_max)}`
          : null,
      tags:
        s.Tags?.map((serviceOnTag) => ({
          name: serviceOnTag.Tag?.name,
          category: serviceOnTag.Tag?.category,
        })) || [],
      image: await pickImage(s),
    })),
  );
}

function SearchVoucherDTO(vouchers) {
  return vouchers.map((v) => ({
    id: v.id,
    title: v.title,
    code: v.code,
    discount: v.discount_percent,
    valid_to: v.valid_to,
    is_global: v.is_global,
    service: v.service
      ? {
          id: v.service.id,
          name: v.service.name,
          location: v.service.location,
          type: v.service.Type?.name,
          tags:
            v.service.Tags?.map((serviceOnTag) => ({
              name: serviceOnTag.Tag?.name,
              category: serviceOnTag.Tag?.category,
            })).filter((tag) => tag.name) || [], // Filter out invalid tags
        }
      : null,
  }));
}

function SearchRoomDTO(rooms) {
  return rooms.map((r) => ({
    id: r.id,
    name: r.name,
    price_per_night: Number(r.price_per_night),
    pet_allowed: r.pet_allowed,
    image: r.images?.find((img) => img.is_main)?.url || r.images?.[0]?.url || null,
    facilities: r.facilities?.map((f) => f.facility?.name) || [],
    service: {
      id: r.service.id,
      name: r.service.name,
      location: r.service.location,
      rating: r.service.rating,
      tags:
        r.service.Tags?.map((serviceOnTag) => ({
          name: serviceOnTag.Tag?.name,
          category: serviceOnTag.Tag?.category,
        })) || [],
    },
  }));
}

function SearchMenuDTO(menus) {
  return menus.map((m) => ({
    id: m.id,
    name: m.name,
    cover: m.cover_url,
    items:
      m.MenuItems?.map((i) => ({
        name: i.name,
        price: i.price,
        unit: i.unit,
      })) || [],
    service: m.Service
      ? {
          id: m.Service.id,
          name: m.Service.name,
          tags:
            m.Service.Tags?.map((serviceOnTag) => ({
              name: serviceOnTag.Tag?.name,
              category: serviceOnTag.Tag?.category,
            })) || [],
        }
      : null,
  }));
}

function SearchTicketDTO(tickets) {
  return tickets.map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    place: t.Place ? { name: t.Place.name, image: t.Place.image_url } : null,
    service: t.Service
      ? {
          id: t.Service.id,
          name: t.Service.name,
          tags:
            t.Service.Tags?.map((serviceOnTag) => ({
              name: serviceOnTag.Tag?.name,
              category: serviceOnTag.Tag?.category,
            })) || [],
        }
      : null,
  }));
}

function SearchPlaceDTO(places) {
  return places.map((p) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    image: p.image_url,
    entry_fee: p.entry_fee,
    tours: p.TourPlace?.map((tp) => tp.Tour?.name).filter(Boolean) || [],
    tickets: p.Tickets?.map((t) => t.name) || [],
  }));
}

function SearchTourDTO(tours) {
  return tours.map((t) => ({
    id: t.id,
    name: t.name,
    total_price: t.total_price,
    duration: t.duration,
    places: t.TourPlace?.map((tp) => tp.Place?.name).filter(Boolean) || [],
    service: t.Service
      ? {
          id: t.Service.id,
          name: t.Service.name,
          tags:
            t.Service.Tags?.map((serviceOnTag) => ({
              name: serviceOnTag.Tag?.name,
              category: serviceOnTag.Tag?.category,
            })) || [],
        }
      : null,
  }));
}

function SearchProviderDTO(providers) {
  return providers.map((p) => ({
    id: p.id,
    name: p.user?.name,
    logo: p.logo_url,
    province: p.province,
    services_count: p.Services?.length || 0,
  }));
}

module.exports = {
  SearchServiceDTO,
  SearchVoucherDTO,
  SearchRoomDTO,
  SearchMenuDTO,
  SearchTicketDTO,
  SearchPlaceDTO,
  SearchTourDTO,
  SearchProviderDTO,
};
