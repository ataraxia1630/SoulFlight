class UniversalSearchBuilder {
  constructor() {
    this.where = { AND: [] };
  }

  addUniversalCondition(fields, keyword) {
    if (!fields?.length) return this;

    if (!keyword?.trim()) {
      return this;
    }

    const orConditions = fields.map((field) => {
      if (typeof field === "string") return { [field]: { contains: keyword, mode: "insensitive" } };
      return field;
    });

    this.where.AND.push({ OR: orConditions });
    return this;
  }

  static hasNonQueryFilters(intent) {
    return (
      (intent.location !== null && intent.location !== undefined) ||
      intent.priceMin !== null ||
      intent.priceMax !== null ||
      (intent.guests !== null && intent.guests !== undefined) ||
      intent.pet_friendly === true
    );
  }

  // Apply query nếu không có filter khác
  addQueryIfNoOtherFilters(intent, keyword, entityType) {
    const hasOtherFilters = UniversalSearchBuilder.hasNonQueryFilters(intent);

    if (!hasOtherFilters && (intent.query || keyword)) {
      const methodMap = {
        service: "addUniversalForService",
        voucher: "addUniversalForVoucher",
        room: "addUniversalForRoom",
        menu: "addUniversalForMenu",
        ticket: "addUniversalForTicket",
        place: "addUniversalForPlace",
        tour: "addUniversalForTour",
        provider: "addUniversalForProvider",
      };

      const method = methodMap[entityType];
      if (method && this[method]) {
        this[method](intent.query || keyword);
      }
    }

    return this;
  }

  // entity specific
  addUniversalKeyword(keyword) {
    return this.addUniversalCondition(
      ["name", "title", "description", "location", "address", "province", "code"],
      keyword,
    );
  }

  addUniversalForService(keyword) {
    return this.addUniversalCondition(
      [
        "name",
        "description",
        "location",
        { Type: { name: { contains: keyword, mode: "insensitive" } } },
        {
          Tags: {
            some: { Tag: { name: { contains: keyword, mode: "insensitive" } } },
          },
        },
        { Provider: { province: { contains: keyword, mode: "insensitive" } } },
      ],
      keyword,
    );
  }

  addUniversalForVoucher(keyword) {
    return this.addUniversalCondition(
      [
        "title",
        "code",
        "description",
        { Service: { name: { contains: keyword, mode: "insensitive" } } },
        { Service: { location: { contains: keyword, mode: "insensitive" } } },
      ],
      keyword,
    );
  }

  addUniversalForRoom(keyword) {
    return this.addUniversalCondition(
      [
        "name",
        "description",
        { service: { name: { contains: keyword, mode: "insensitive" } } },
        { service: { location: { contains: keyword, mode: "insensitive" } } },
      ],
      keyword,
    );
  }

  addUniversalForMenu(keyword) {
    return this.addUniversalCondition(
      [
        "name",
        {
          MenuItems: {
            some: { name: { contains: keyword, mode: "insensitive" } },
          },
        },
        { Service: { name: { contains: keyword, mode: "insensitive" } } },
        { Service: { location: { contains: keyword, mode: "insensitive" } } },
      ],
      keyword,
    );
  }

  addUniversalForTicket(keyword) {
    return this.addUniversalCondition(
      [
        "name",
        { Place: { name: { contains: keyword, mode: "insensitive" } } },
        { Place: { address: { contains: keyword, mode: "insensitive" } } },
        { Service: { name: { contains: keyword, mode: "insensitive" } } },
        { Service: { location: { contains: keyword, mode: "insensitive" } } },
      ],
      keyword,
    );
  }

  addUniversalForPlace(keyword) {
    return this.addUniversalCondition(["name", "description", "address"], keyword);
  }

  addUniversalForTour(keyword) {
    return this.addUniversalCondition(
      [
        "name",
        {
          TourPlace: {
            some: {
              Place: { name: { contains: keyword, mode: "insensitive" } },
            },
          },
        },
        { Service: { name: { contains: keyword, mode: "insensitive" } } },
        { Service: { location: { contains: keyword, mode: "insensitive" } } },
      ],
      keyword,
    );
  }

  addUniversalForProvider(keyword) {
    return this.addUniversalCondition(["description", "province", { user: { name: {} } }], keyword);
  }

  // filter
  applyFilters(intent, entityType = "service") {
    const { location, priceMin, priceMax, guests } = intent;

    if (location) {
      const locConditions = [];

      const addLoc = (path) => locConditions.push(path);
      switch (entityType) {
        case "service":
          addLoc({ location: { contains: location, mode: "insensitive" } });
          addLoc({
            Provider: { province: { contains: location, mode: "insensitive" } },
          });
          break;
        case "room":
        case "voucher":
          addLoc({
            service: { location: { contains: location, mode: "insensitive" } },
          });
          addLoc({
            service: {
              Provider: {
                province: { contains: location, mode: "insensitive" },
              },
            },
          });
          break;

        case "menu":
          addLoc({
            Service: { location: { contains: location, mode: "insensitive" } },
          });
          addLoc({
            Service: {
              Provider: {
                province: { contains: location, mode: "insensitive" },
              },
            },
          });
          break;
        case "ticket":
          addLoc({
            Service: { location: { contains: location, mode: "insensitive" } },
          });
          addLoc({
            Service: {
              Provider: {
                province: { contains: location, mode: "insensitive" },
              },
            },
          });
          addLoc({
            Place: { address: { contains: location, mode: "insensitive" } },
          });
          break;
        case "place":
          addLoc({ address: { contains: location, mode: "insensitive" } });
          break;
        case "tour":
          addLoc({
            Service: { location: { contains: location, mode: "insensitive" } },
          });
          addLoc({
            Service: {
              Provider: {
                province: { contains: location, mode: "insensitive" },
              },
            },
          });
          addLoc({
            TourPlace: {
              some: {
                Place: { address: { contains: location, mode: "insensitive" } },
              },
            },
          });
          break;
        case "provider":
          addLoc({ province: { contains: location, mode: "insensitive" } });
          break;
      }

      if (locConditions.length) this.where.AND.push({ OR: locConditions });
    }

    if (priceMin !== null || priceMax !== null) {
      const min = priceMin != null ? parseFloat(priceMin) : null;
      const max = priceMax != null ? parseFloat(priceMax) : null;
      const priceConditions = [];

      switch (entityType) {
        case "service":
          if (min !== null && max !== null) {
            priceConditions.push({
              OR: [
                {
                  AND: [{ price_min: { lte: max } }, { price_max: { gte: min } }],
                },
                { price_min: null },
                { price_max: null },
              ],
            });
          } else if (min !== null)
            priceConditions.push({
              OR: [{ price_max: { gte: min } }, { price_max: null }],
            });
          else if (max !== null)
            priceConditions.push({
              OR: [{ price_min: { lte: max } }, { price_min: null }],
            });
          break;
        case "room":
          if (min !== null && max !== null)
            priceConditions.push({ price_per_night: { gte: min, lte: max } });
          else if (min !== null) priceConditions.push({ price_per_night: { gte: min } });
          else if (max !== null) priceConditions.push({ price_per_night: { lte: max } });
          break;
        case "ticket":
          if (min !== null && max !== null) priceConditions.push({ price: { gte: min, lte: max } });
          else if (min !== null) priceConditions.push({ price: { gte: min } });
          else if (max !== null) priceConditions.push({ price: { lte: max } });
          break;
        case "tour":
          if (min !== null && max !== null)
            priceConditions.push({ total_price: { gte: min, lte: max } });
          else if (min !== null) priceConditions.push({ total_price: { gte: min } });
          else if (max !== null) priceConditions.push({ total_price: { lte: max } });
          break;
      }

      if (priceConditions.length) this.where.AND.push(...priceConditions);
    }

    // guests (room)
    if (guests != null && entityType === "room") {
      const guestCount = parseInt(guests, 10);
      this.where.AND.push({
        OR: [{ max_adult_number: { gte: guestCount } }, { max_adult_number: null }],
      });
    }

    return this;
  }

  // build
  build() {
    return this.where.AND.length ? { AND: this.where.AND } : {};
  }

  buildForVoucher() {
    const now = new Date();
    const base = this.build();
    return {
      AND: [...(base.AND || []), { OR: [{ valid_to: { gte: now } }, { valid_to: null }] }],
    };
  }
}

module.exports = { UniversalSearchBuilder };
