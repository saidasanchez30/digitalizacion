// Formatear fecha a DD/MM/YYYY
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Formatear fecha y hora a DD/MM/YYYY HH:MM
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Formatear cantidad de páginas con separador de miles
export const formatPages = (pages) => {
  if (!pages) return '0';
  return pages.toLocaleString('es-CO');
};

// Formatear moneda (COP por defecto)
export const formatCurrency = (amount, currency = 'COP') => {
  if (amount === null || amount === undefined) return '-';
  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

// Formatear porcentaje
export const formatPercentage = (percent) => {
  if (!percent && percent !== 0) return '-';
  return `${percent}%`;
};

// Parsear query params de URL
export const parseQueryParams = (search) => {
  const params = new URLSearchParams(search);
  const result = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

// Capitalizar primera letra
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
