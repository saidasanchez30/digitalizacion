import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// SERVICES
export const getServices = async () => {
  const response = await apiClient.get('/services/');
  return response.data;
};

// EXTRAS
export const getExtras = async () => {
  const response = await apiClient.get('/extras/');
  return response.data;
};

// QUOTATIONS
export const postQuotation = async (quotationData) => {
  const response = await apiClient.post('/quotations/', quotationData);
  return response.data;
};

export const getQuotations = async () => {
  const response = await apiClient.get('/quotations/');
  return response.data;
};

export const getQuotationById = async (quotationId) => {
  const response = await apiClient.get(`/quotations/${quotationId}`);
  return response.data;
};

// ORDERS
export const postOrder = async (orderData) => {
  const response = await apiClient.post('/orders/', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await apiClient.get('/orders/');
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await apiClient.post(`/orders/${orderId}/cancel`);
  return response.data;
};

export const updateOrderStatus = async (orderId, statusData) => {
  const response = await apiClient.put(`/orders/${orderId}/status`, statusData);
  return response.data;
};

// VAULT
export const getVaultDocuments = async (orderId) => {
  const response = await apiClient.get(`/orders/${orderId}/vault`);
  return response.data;
};

export const postVaultDocument = async (orderId, documentData) => {
  const response = await apiClient.post(`/orders/${orderId}/vault/documents`, documentData);
  return response.data;
};

export default apiClient;
