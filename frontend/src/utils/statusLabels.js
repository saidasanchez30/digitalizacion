// Mapeo de estados de orden a etiquetas en español
export const orderStatusLabels = {
  pickup_scheduled: 'Recolección agendada',
  documents_collected: 'Documentos recolectados',
  digitizing: 'En digitalización',
  quality_review: 'Revisión de calidad',
  preparing_delivery: 'Preparando entrega',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  available_in_vault: 'Disponible en bóveda',
};

// Mapeo de estados de pago a etiquetas en español
export const paymentStatusLabels = {
  payment_confirmed: 'Pago confirmado',
  payment_pending: 'Pago pendiente',
  payment_failed: 'Pago fallido',
};

// Colores por estado de orden (para badges)
export const orderStatusColors = {
  pickup_scheduled: '#3b82f6', // azul
  documents_collected: '#8b5cf6', // púrpura
  digitizing: '#f59e0b', // ámbar
  quality_review: '#ec4899', // rosa
  preparing_delivery: '#10b981', // verde
  delivered: '#059669', // verde oscuro
  cancelled: '#6b7280', // gris
  available_in_vault: '#0891b2', // cian
};

// Colores por estado de pago (para badges)
export const paymentStatusColors = {
  payment_confirmed: '#10b981', // verde
  payment_pending: '#f59e0b', // ámbar
  payment_failed: '#ef4444', // rojo
};

// Secuencia de estados válidos para timeline
export const orderStatusSequence = [
  'pickup_scheduled',
  'documents_collected',
  'digitizing',
  'quality_review',
  'preparing_delivery',
  'delivered',
];

// Obtener color de estado
export const getOrderStatusColor = (status) => {
  return orderStatusColors[status] || '#6b7280';
};

// Obtener color de estado de pago
export const getPaymentStatusColor = (status) => {
  return paymentStatusColors[status] || '#6b7280';
};

// Obtener etiqueta de estado
export const getOrderStatusLabel = (status) => {
  return orderStatusLabels[status] || status;
};

// Obtener etiqueta de pago
export const getPaymentStatusLabel = (status) => {
  return paymentStatusLabels[status] || status;
};
