import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`;

const SearchService = {
  search: async (type, payload = {}) => {
    const url = `${API_BASE_URL}/search/${type}`;

    if (payload.mode === "voice" || payload.mode === "image") {
      const formData = new FormData();
      formData.append("mode", payload.mode);
      formData.append("file", payload.file);
      if (payload.keyword) formData.append("keyword", payload.keyword);
      if (payload.location) formData.append("location", payload.location);

      Object.keys(payload).forEach((key) => {
        if (!["mode", "file", "keyword", "location"].includes(key)) {
          formData.append(key, payload[key]);
        }
      });

      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }

    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  searchAll: async (payload = {}) => {
    const types = ["services", "rooms", "menus", "tickets", "tours"];
    const requests = types.map((type) =>
      SearchService.search(type, payload).catch(() => ({ data: [] })),
    );

    const responses = await Promise.all(requests);

    return types.reduce((acc, type, i) => {
      acc[`${type}s`] = responses[i].data || [];
      return acc;
    }, {});
  },
};

export default SearchService;
