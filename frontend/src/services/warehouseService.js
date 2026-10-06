import axios from "axios";

const API_URL = "http://localhost:8080/api/warehouses";

export const getWarehouses = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getWarehouseById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createWarehouse = async (warehouse) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, warehouse, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateWarehouse = async (id, warehouse) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${API_URL}/${id}`, warehouse, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteWarehouse = async (id) => {
  const token = localStorage.getItem("token");

  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};