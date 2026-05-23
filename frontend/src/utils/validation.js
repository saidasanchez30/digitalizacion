// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar que no esté vacío
export const isNotEmpty = (value) => {
  return value && value.trim().length > 0;
};

// Validar que sea número positivo
export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

// Validar teléfono (mínimo 10 dígitos)
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Validar cantidad de páginas
export const isValidPages = (pages) => {
  const num = Number(pages);
  return !isNaN(num) && num > 0 && num <= 999999;
};

// Validación completa de formulario de cotización
export const validateQuotationForm = (formData) => {
  const errors = {};

  if (!isNotEmpty(formData.company_name)) {
    errors.company_name = 'El nombre de la empresa es requerido';
  }

  if (!isNotEmpty(formData.contact_name)) {
    errors.contact_name = 'El nombre de contacto es requerido';
  }

  if (!isValidEmail(formData.email)) {
    errors.email = 'Correo electrónico inválido';
  }

  if (!isNotEmpty(formData.phone)) {
    errors.phone = 'El teléfono es requerido';
  }

  if (!formData.service_id) {
    errors.service_id = 'Debes seleccionar un plan';
  }

  if (!isValidPages(formData.estimated_pages)) {
    errors.estimated_pages = 'Cantidad de páginas debe ser un número mayor a 0';
  }

  if (!isNotEmpty(formData.delivery_method)) {
    errors.delivery_method = 'Debes seleccionar un método de entrega';
  }

  if (!formData.pickup_date) {
    errors.pickup_date = 'La fecha de recolección es requerida';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validación de formulario de método de pago
export const validateCheckoutForm = (formData) => {
  const errors = {};

  if (!formData.payment_method) {
    errors.payment_method = 'Debes seleccionar un método de pago';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
