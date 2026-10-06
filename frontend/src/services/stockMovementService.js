import axios from "axios";

const API_URL = "http://localhost:8080/api/stock-movements";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getStockMovements = async () => {
  const response = await axios.get(
    API_URL,
    getAuthHeaders()
  );

  return response.data;
};