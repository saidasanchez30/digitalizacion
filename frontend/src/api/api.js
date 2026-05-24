import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8001',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/* ── Interceptor: respuesta estándar ── */
apiClient.interceptors.response.use(
  res => res,
  err => {
    /* Normaliza errores de red para mensaje legible */
    if (!err.response) {
      err.message = 'No se pudo conectar con el servidor. Verifica que el backend esté activo.';
    }
    return Promise.reject(err);
  }
);

/* ── Services ── */
export const getServices = () => apiClient.get('/services/');
export const getExtras   = () => apiClient.get('/extras/');

/* ── Quotations ── */
export const postQuotation    = (data) => apiClient.post('/quotations/', data);
export const getQuotations    = ()     => apiClient.get('/quotations/');
export const getQuotationById = (id)   => apiClient.get(`/quotations/${id}`);

/* ── Orders ── */
export const postOrder       = (data)       => apiClient.post('/orders/', data);
export const getOrders       = ()           => apiClient.get('/orders/');
export const getOrderById    = (id)         => apiClient.get(`/orders/${id}`);
export const cancelOrder     = (id)         => apiClient.post(`/orders/${id}/cancel`);
export const updateOrderStatus = (id, data) => apiClient.put(`/orders/${id}/status`, data);

/* ── Vault ── */
export const getVaultDocuments  = (orderId)       => apiClient.get(`/orders/${orderId}/vault`);
export const postVaultDocument  = (orderId, data) => apiClient.post(`/orders/${orderId}/vault/documents`, data);

export default apiClient;
