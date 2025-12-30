import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/service-tag`;

const TagService = {
  /**
   * @param {Object} params
   * @param {'stay'|'fnb'|'tour'} params.type
   * @param {'model'|'other'|null} params.mode - null = cả 2
   * @returns {Promise<Object>}
   */
  getByType: async ({ type, mode = null }) => {
    try {
      const validTypes = ["stay", "fnb", "tour", "transport", "leisure"];
      if (!type || !validTypes.includes(type)) {
        throw new Error("type is required and must be valid");
      }

      const validModes = ["model", "other"];
      if (mode && !validModes.includes(mode)) {
        throw new Error("mode must be 'model' or 'other'");
      }

      const params = new URLSearchParams();
      params.append("type", type);
      if (mode) params.append("mode", mode);
      console.log("TagService.getByType params:", params.toString());

      const url = `${API_URL}/type?${params.toString()}`;

      const response = await axios.get(url);

      if (!response.data.success) {
        throw new Error(response.data.message || "API error");
      }

      return response.data.data;
    } catch (error) {
      console.error("TagService.getByType error:", error.message);
      throw error;
    }
  },
};

export default TagService;
