import api from "@/shared/utils/axiosInstance";

const API_BASE_URL = "/api/search/services";

const SearchService = {
  searchServices: async (payload = {}) => {
    // image search (file ảnh)
    if (payload.mode === "image" && payload.file) {
      const formData = new FormData();
      formData.append("mode", payload.mode);
      formData.append("file", payload.file);
      if (payload.location) formData.append("location", payload.location);

      const res = await api.post(API_BASE_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data?.data || res.data;
    }

    // text/voice search (json)
    const jsonPayload = {
      keyword: payload.keyword || "",
      location: payload.location || null,
      priceMin: payload.priceMin || null,
      priceMax: payload.priceMax || null,
      guests: payload.guests || null,
      mode: payload.mode || "text",
      ...payload.filters,
    };

    const res = await api.post(API_BASE_URL, jsonPayload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data?.data || res.data;
  },

  searchAll: async (payload = {}) => {
    return await SearchService.searchServices(payload);
  },
};

export default SearchService;
