import axios from "axios";

const API_URL = "http://localhost:8080/api/inventory";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all inventory
export const getInventory = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

// Get inventory by ID
export const getInventoryById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );

  return response.data;
};

// Create inventory
export const createInventory = async (inventoryData) => {
  const response = await axios.post(
    API_URL,
    inventoryData,
    getAuthHeaders()
  );

  return response.data;
};

// Update inventory
export const updateInventory = async (id, inventoryData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    inventoryData,
    getAuthHeaders()
  );

  return response.data;
};

// Delete inventory
export const deleteInventory = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );

  return response.data;
};