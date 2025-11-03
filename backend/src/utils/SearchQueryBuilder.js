class SearchQueryBuilder {
  constructor() {
    this.where = { AND: [] };
  }

  addKeywordSearch(query) {
    if (!query?.trim()) return this;
    this.where.AND.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } },
        { Type: { name: { contains: query, mode: "insensitive" } } },
        {
          Tags: {
            some: { Tag: { name: { contains: query, mode: "insensitive" } } },
          },
        },
        {
          Vouchers: {
            some: { title: { contains: query, mode: "insensitive" } },
          },
        },
      ],
    });
    return this;
  }

  addLocation(location) {
    if (location) {
      this.where.AND.push({
        location: { contains: location, mode: "insensitive" },
      });
    }
    return this;
  }

  // Các hàm search (voucher, room, menu, ticket, place, tour, provider)
  addKeywordInVoucher(query) {
    if (!query?.trim()) return this;
    this.where.AND.push({
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { code: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { service: { name: { contains: query, mode: "insensitive" } } },
      ],
    });
    return this;
  }

  addKeywordInRoom(query) {
    if (!query?.trim()) return this;
    this.where.AND.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { service: { name: { contains: query, mode: "insensitive" } } },
      ],
    });
    return this;
  }

  addKeywordInMenu(query) {
    if (!query?.trim()) return this;
    this.where.AND.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        {
          MenuItems: {
            some: { name: { contains: query, mode: "insensitive" } },
          },
        },
        { Service: { name: { contains: query, mode: "insensitive" } } },
      ],
    });
    return this;
  }

  addKeywordInTicket(query) {
    if (!query?.trim()) return this;
    this.where.AND.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { Place: { name: { contains: query, mode: "insensitive" } } },
        { Service: { name: { contains: query, mode: "insensitive" } } },
      ],
    });
    return this;
  }

  addKeywordInPlace(query) {
    if (!query?.trim()) return this;
    this.where.AND.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { address: { contains: query, mode: "insensitive" } },
      ],
    });
    return this;
  }

  addKeywordInTour(query) {
    if (!query?.trim()) return this;
    this.where.AND.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        {
          TourPlace: {
            some: { Place: { name: { contains: query, mode: "insensitive" } } },
          },
        },
        { Service: { name: { contains: query, mode: "insensitive" } } },
      ],
    });
    return this;
  }

  addKeywordInProvider(query) {
    if (!query?.trim()) return this;
    this.where.AND.push({
      OR: [
        { description: { contains: query, mode: "insensitive" } },
        { province: { contains: query, mode: "insensitive" } },
        { user: { name: { contains: query, mode: "insensitive" } } },
      ],
    });
    return this;
  }

  build() {
    return this.where.AND.length ? { AND: this.where.AND } : {};
  }
  buildForVoucher() {
    return this.build();
  }
  buildForRoom() {
    return this.build();
  }
  buildForMenu() {
    return this.build();
  }
  buildForTicket() {
    return this.build();
  }
  buildForPlace() {
    return this.build();
  }
  buildForTour() {
    return this.build();
  }
  buildForProvider() {
    return this.build();
  }
}

module.exports = SearchQueryBuilder;
