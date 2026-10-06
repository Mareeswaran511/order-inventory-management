import axios from "axios";

const API_URL = "http://localhost:8080/api/order-items";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getOrderItems = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const getOrderItemsByOrderId = async (orderId) => {
  const response = await axios.get(
    `${API_URL}/order/${orderId}`,
    getAuthHeaders()
  );

  return response.data;
};

export const getOrderItemById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );

  return response.data;
};

export const createOrderItem = async (orderItemData) => {
  const response = await axios.post(
    API_URL,
    orderItemData,
    getAuthHeaders()
  );

  return response.data;
};

export const updateOrderItem = async (id, orderItemData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    orderItemData,
    getAuthHeaders()
  );

  return response.data;
};

export const deleteOrderItem = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );

  return response.data;
};