const parseKeywordIntent = (rawText) => {
  if (!rawText?.trim()) {
    return {
      query: "",
      location: null,
      priceMin: null,
      priceMax: null,
      guests: null,
    };
  }

  const keyword = rawText
    .replace(/```/g, "")
    .replace(/^json\s+/i, "")
    .trim();

  // nếu dùng AI thì trả về obj của AI
  try {
    const obj = JSON.parse(keyword);
    if (obj.mode === "voice" || obj.mode === "image") {
      return obj;
    }
  } catch (_e) {
    console.error("Bug");
  }

  let query = keyword.trim();
  let location = null;
  let priceMin = null;
  let priceMax = null;
  let guests = null;
  let pet_friendly = null;

  const knownLocations = [
    "An Giang",
    "Bắc Ninh",
    "Cà Mau",
    "Cao Bằng",
    "TP. Cần Thơ",
    "TP. Đà Nẵng",
    "Đắk Lắk",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "TP.Hà Nội",
    "Hà Tĩnh",
    "TP.Hải Phòng",
    "TP.Hồ Chí Minh",
    "TP.Huế",
    "Hưng Yên",
    "Khánh Hòa",
    "Lai Châu",
    "Lạng Sơn",
    "Lào Cai",
    "Lâm Đồng",
    "Nghệ An",
    "Ninh Bình",
    "Phú Thọ",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sơn La",
    "Tây Ninh",
    "Thái Nguyên",
    "Thanh Hóa",
    "Tuyên Quang",
    "Vĩnh Long",
  ];

  // Price
  const priceMaxMatch = keyword.match(
    /(?:giá\s+)?(?:dưới|under|<|max)\s*([\d,.]+)\s*(?:k|triệu|đ|vnd)?/i,
  );
  if (priceMaxMatch) {
    let price = priceMaxMatch[1].replace(/[,.]/g, "");
    if (keyword.includes("triệu")) price = parseFloat(price) * 1000000;
    else if (keyword.includes("k")) price = parseFloat(price) * 1000;
    priceMax = parseFloat(price);
    query = query.replace(priceMaxMatch[0], "").trim();
  }

  const priceMinMatch = keyword.match(
    /(?:giá\s+)?(?:trên|over|>|min)\s*([\d,.]+)\s*(?:k|triệu|đ|vnd)?/i,
  );
  if (priceMinMatch) {
    let price = priceMinMatch[1].replace(/[,.]/g, "");
    if (keyword.includes("triệu")) price = parseFloat(price) * 1000000;
    else if (keyword.includes("k")) price = parseFloat(price) * 1000;
    priceMin = parseFloat(price);
    query = query.replace(priceMinMatch[0], "").trim();
  }

  const priceRangeMatch = keyword.match(
    /([\d,.]+)\s*(?:k|triệu)?\s*[-đến]+\s*([\d,.]+)\s*(?:k|triệu)?/i,
  );
  if (priceRangeMatch) {
    let min = priceRangeMatch[1].replace(/[,.]/g, "");
    let max = priceRangeMatch[2].replace(/[,.]/g, "");
    if (keyword.includes("triệu")) {
      min = parseFloat(min) * 1000000;
      max = parseFloat(max) * 1000000;
    } else if (keyword.includes("k")) {
      min = parseFloat(min) * 1000;
      max = parseFloat(max) * 1000;
    }
    priceMin = parseFloat(min);
    priceMax = parseFloat(max);
    query = query.replace(priceRangeMatch[0], "").trim();
  }

  // guests
  const guestsMatch = keyword.match(/(?:cho\s+)?([\d]+)\s*(?:người|khách|guests?|pax)/i);
  if (guestsMatch) {
    guests = parseInt(guestsMatch[1], 10);
    query = query.replace(guestsMatch[0], "").trim();
  }

  // pet
  if (/(cho phép|với|có)\s*(thú cưng|pet|động vật)|pet\s*friendly|pet\s*allowed/i.test(keyword)) {
    pet_friendly = true;
    query = query
      .replace(/(cho phép|với|có)\s*(thú cưng|pet|động vật)|pet\s*friendly|pet\s*allowed/gi, "")
      .trim();
  }

  // location
  const locationMatch = keyword.match(/(?:ở|tại|in|at)\s+([^\s,]+(?:\s+[^\s,]+)?)/i);
  if (locationMatch) {
    location = locationMatch[1].trim();
    query = query.replace(locationMatch[0], "").trim();
  }

  // Nếu keyword trùng với 1 tỉnh đã biết mà chưa có location -> gán location
  if (
    !location &&
    knownLocations.some((loc) => keyword.toLowerCase().includes(loc.toLowerCase()))
  ) {
    location = knownLocations.find((loc) => keyword.toLowerCase().includes(loc.toLowerCase()));
  }

  query = query.replace(/\s+/g, " ").trim();

  if (!query && keyword && !pet_friendly && !priceMin && !priceMax && !guests && !location) {
    query = keyword;
  }

  const intent = {
    query,
    location,
    priceMin,
    priceMax,
    guests,
    ...(pet_friendly !== null && { pet_friendly }),
  };

  console.log("Parsed Intent:", intent);
  return intent;
};

module.exports = { parseKeywordIntent };
