import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

export const getProducts = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getProductById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createProduct = async (product) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, product, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProduct = async (id, product) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${id}`,
    product,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");

  await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};