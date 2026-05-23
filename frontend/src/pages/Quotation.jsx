import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getServices, getExtras, postQuotation } from '../api/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import ExtraSelector from '../components/ExtraSelector';
import DeliveryMethodSelector from '../components/DeliveryMethodSelector';
import { validateQuotationForm } from '../utils/validation';
import { formatCurrency, formatDate, parseQueryParams } from '../utils/formatters';

function Quotation() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = parseQueryParams(location.search);

  const [services, setServices] = useState([]);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [quotationGenerated, setQuotationGenerated] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    service_id: queryParams.serviceId ? parseInt(queryParams.serviceId) : null,
    estimated_pages: '',
    delivery_method: '',
    pickup_date: '',
    extra_ids: [],
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, extrasData] = await Promise.all([
          getServices(),
          getExtras(),
        ]);
        setServices(servicesData);
        setExtras(extrasData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedService = services.find(s => s.id === formData.service_id);
  const isPremium = selectedService?.is_premium || false;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let parsedValue = value;

    if (name === 'service_id') {
        parsedValue = parseInt(value, 10);
    }

    if (name === 'estimated_pages') {
        parsedValue = value === '' ? '' : parseInt(value, 10);
    }

    setFormData(prev => ({
        ...prev,
        [name]: parsedValue,
    }));

    // Limpiar error al cambiar campo
    if (formErrors[name]) {
        setFormErrors(prev => ({
        ...prev,
        [name]: null,
        }));
    }
    };

  const handleExtraToggle = (extraId) => {
    setFormData(prev => ({
      ...prev,
      extra_ids: prev.extra_ids.includes(extraId)
        ? prev.extra_ids.filter(id => id !== extraId)
        : [...prev.extra_ids, extraId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar
    const { isValid, errors } = validateQuotationForm(formData);
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      const response = await postQuotation(formData);
      setQuotationGenerated(response);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al generar cotización');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Cargando catálogo..." />;

  // Si ya se generó cotización, mostrar resumen
  if (quotationGenerated) {
    return (
      <div>
        <div className="alert alert-success">
          <h3>✓ Cotización generada exitosamente</h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-lg)',
          marginBottom: 'var(--space-2xl)',
        }}>
          {[
            { label: 'ID Cotización', value: `#${quotationGenerated.id}` },
            { label: 'Empresa', value: quotationGenerated.company_name },
            { label: 'Contacto', value: quotationGenerated.contact_name },
            { label: 'Correo', value: quotationGenerated.email },
            { label: 'Teléfono', value: quotationGenerated.phone },
            { label: 'Plan', value: selectedService?.name || '-' },
            { label: 'Páginas estimadas', value: quotationGenerated.estimated_pages.toLocaleString('es-CO') },
            { label: 'Método entrega', value: quotationGenerated.delivery_method },
            { label: 'Fecha recolección', value: formatDate(quotationGenerated.pickup_date) },
            { label: 'Fecha entrega estimada', value: formatDate(quotationGenerated.estimated_delivery_date) },
          ].map((item, idx) => (
            <div key={idx} className="card">
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)' }}>
                {item.label}
              </div>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Resumen de precios</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 'var(--space-lg)',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)',
          }}>
            <div>Subtotal (digitalización)</div>
            <div style={{ fontWeight: '600' }}>{formatCurrency(quotationGenerated.subtotal)}</div>

            {quotationGenerated.extras_total > 0 && (
              <>
                <div>Extras</div>
                <div style={{ fontWeight: '600' }}>{formatCurrency(quotationGenerated.extras_total)}</div>
              </>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 'var(--space-lg)',
          }}>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700' }}>Total</div>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-secondary)' }}>
              {formatCurrency(quotationGenerated.total)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => navigate(`/checkout/${quotationGenerated.id}`)}
          >
            Confirmar compra →
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              setQuotationGenerated(null);
              setFormData({
                company_name: '',
                contact_name: '',
                email: '',
                phone: '',
                service_id: null,
                estimated_pages: '',
                delivery_method: '',
                pickup_date: '',
                extra_ids: [],
              });
            }}
          >
            Generar otra cotización
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-lg)' }}>Cotizador de Servicios</h1>

      {error && <ErrorMessage title="Error" message={error} />}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-2xl)' }}>
        {/* Datos de empresa */}
        <section className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Información de la empresa</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre de la empresa *</label>
              <input
                type="text"
                name="company_name"
                className="form-input"
                value={formData.company_name}
                onChange={handleInputChange}
                placeholder="Ej: Acme Corp S.A."
              />
              {formErrors.company_name && <div className="form-error">{formErrors.company_name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Nombre de contacto *</label>
              <input
                type="text"
                name="contact_name"
                className="form-input"
                value={formData.contact_name}
                onChange={handleInputChange}
                placeholder="Ej: Juan García"
              />
              {formErrors.contact_name && <div className="form-error">{formErrors.contact_name}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Correo electrónico *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contacto@empresa.com"
              />
              {formErrors.email && <div className="form-error">{formErrors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+57 555 1234567"
              />
              {formErrors.phone && <div className="form-error">{formErrors.phone}</div>}
            </div>
          </div>
        </section>

        {/* Selección de plan */}
        <section className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Selecciona tu plan *</h3>

          <div className="grid grid-2">
            {services.map((service) => (
              <label
                key={service.id}
                style={{
                  padding: 'var(--space-lg)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  backgroundColor: formData.service_id === service.id ? 'rgba(99, 102, 241, 0.05)' : 'var(--color-white)',
                  borderColor: formData.service_id === service.id ? '#6366f1' : 'var(--color-border)',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="radio"
                  name="service_id"
                  value={service.id}
                  checked={formData.service_id === service.id}
                  onChange={handleInputChange}
                  style={{ marginRight: 'var(--space-md)', cursor: 'pointer' }}
                />
                <strong>{service.name}</strong>
                {service.is_premium && (
                  <span className="badge badge-info" style={{ marginLeft: 'var(--space-md)' }}>
                    Premium
                  </span>
                )}
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginTop: 'var(--space-sm)' }}>
                  {formatCurrency(service.price_per_1000_pages)} por 1,000 hojas
                </div>
              </label>
            ))}
          </div>
          {formErrors.service_id && <div className="form-error">{formErrors.service_id}</div>}
        </section>

        {/* Detalles de servicio */}
        <section className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Detalles del servicio</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cantidad estimada de páginas *</label>
              <input
                type="number"
                name="estimated_pages"
                className="form-input"
                value={formData.estimated_pages}
                onChange={handleInputChange}
                placeholder="Ej: 5000"
                min="1"
              />
              {formErrors.estimated_pages && <div className="form-error">{formErrors.estimated_pages}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Fecha propuesta de recolección *</label>
              <input
                type="date"
                name="pickup_date"
                className="form-input"
                value={formData.pickup_date}
                onChange={handleInputChange}
              />
              {formErrors.pickup_date && <div className="form-error">{formErrors.pickup_date}</div>}
            </div>
          </div>
        </section>

        {/* Método de entrega */}
        <section className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Método de entrega *</h3>
          <DeliveryMethodSelector
            selectedMethod={formData.delivery_method}
            onSelect={(method) => setFormData(prev => ({ ...prev, delivery_method: method }))}
            isPremium={isPremium}
          />
          {formErrors.delivery_method && <div className="form-error">{formErrors.delivery_method}</div>}
        </section>

        {/* Extras */}
        {extras.length > 0 && (
          <section className="card">
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Servicios adicionales (Extras)</h3>
            <ExtraSelector
              extras={extras}
              selectedExtras={formData.extra_ids}
              onToggleExtra={handleExtraToggle}
            />
          </section>
        )}

        {/* Botón enviar */}
        <button
          type="submit"
          className="btn btn-secondary btn-lg"
          style={{ width: '100%' }}
          disabled={submitting}
        >
          {submitting ? 'Generando cotización...' : 'Generar cotización'}
        </button>
      </form>
    </div>
  );
}

export default Quotation;
