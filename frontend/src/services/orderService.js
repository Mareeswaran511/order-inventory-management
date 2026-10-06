import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getOrders = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );

  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await axios.post(
    API_URL,
    orderData,
    getAuthHeaders()
  );

  return response.data;
};

export const updateOrder = async (id, orderData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    orderData,
    getAuthHeaders()
  );

  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );

  return response.data;
};

export const getOrderTotal = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}/total`,
    getAuthHeaders()
  );

  return response.data;
};