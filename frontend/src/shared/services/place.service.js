import api from "@/shared/utils/axiosInstance";

const BASE = "/api/place";

const PlaceService = {
  getAll: async () => {
    const response = await api.get(BASE);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${BASE}/${id}`);
    return response.data;
  },

  create: async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.address) formData.append("address", data.address);
    if (data.entry_fee) formData.append("entry_fee", data.entry_fee);

    if (data.opening_hours) {
      formData.append("opening_hours", JSON.stringify(data.opening_hours));
    }

    if (data.images && data.images.length > 0) {
      Array.from(data.images).forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await api.post(BASE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, data) => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.address) formData.append("address", data.address);
    if (data.entry_fee) formData.append("entry_fee", data.entry_fee);

    if (data.opening_hours) {
      formData.append("opening_hours", JSON.stringify(data.opening_hours));
    }

    if (data.newImages && data.newImages.length > 0) {
      Array.from(data.newImages).forEach((file) => {
        formData.append("images", file);
      });
    }

    if (data.deletedImageIds && data.deletedImageIds.length > 0) {
      const actions = data.deletedImageIds.map((imgId) => ({
        action: "DELETE",
        imageId: imgId,
      }));
      formData.append("imageActions", JSON.stringify(actions));
    }

    const response = await api.put(`${BASE}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${BASE}/${id}`);
    return response.data;
  },
};

export default PlaceService;
