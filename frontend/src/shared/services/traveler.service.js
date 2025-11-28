import api from "@/shared/utils/axiosInstance";

const BASE = "/api/traveler";

const TravelerService = {
  updateMyProfile: async (formData, avatarFile = null) => {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        data.append(key, value);
      }
    });

    if (avatarFile) data.append("avatar", avatarFile);

    const res = await api.put(`${BASE}/me`, data);
    return res.data.data;
  },

  adminUpdateTraveler: async (userId, formData) => {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    const res = await api.put(`${BASE}/${userId}`, data);

    return res.data.data;
  },

  getAll: async () => {
    const res = await api.get(BASE);
    return res.data.data;
  },

  getMyProfile: async () => {
    const res = await api.get(`${BASE}/me`);
    return res.data.data;
  },
};

export default TravelerService;
