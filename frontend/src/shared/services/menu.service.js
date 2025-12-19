import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/menu`;

const MenuService = {
  getByService: async (serviceId) => {
    const response = await axios.get(`${API_BASE_URL}/service/${serviceId}`);
    return response.data;
  },
};

export default MenuService;
