import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServices, getExtras } from '../api/api';
import ServiceCard from '../components/ServiceCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency } from '../utils/formatters';

function Catalog() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, extrasData] = await Promise.all([
          getServices(),
          getExtras(),
        ]);
        setServices(servicesData);
        setExtras(extrasData);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          err.message ||
          'Error al cargar el catálogo'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectService = (serviceId) => {
    navigate(`/quotation?serviceId=${serviceId}`);
  };

  if (loading) return <Loading message="Cargando catálogo..." />;
  if (error) return <ErrorMessage title="Error al cargar catálogo" message={error} />;

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-lg)' }}>Catálogo de Servicios</h1>

      {/* Planes */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Planes disponibles</h2>
        <div className="grid grid-2">
          {services.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service}
              onSelectService={handleSelectService}
            />
          ))}
        </div>
      </section>

      {/* Extras */}
      <section>
        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Extras disponibles</h2>
        <div className="grid grid-3">
          {extras.map((extra) => (
            <div key={extra.id} className="card">
              <h4 style={{ marginBottom: 'var(--space-sm)' }}>{extra.name}</h4>
              <p style={{ 
                color: 'var(--color-text-light)',
                fontSize: 'var(--font-size-sm)',
                marginBottom: 'var(--space-md)',
              }}>
                {extra.description}
              </p>

              <div style={{ 
                display: 'flex', 
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-md)',
                flexWrap: 'wrap',
              }}>
                {extra.price > 0 && (
                  <span style={{ 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--color-success)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--border-radius)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '600',
                  }}>
                    {formatCurrency(extra.price)}
                  </span>
                )}
                {extra.percentage > 0 && (
                  <span style={{ 
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    color: 'var(--color-warning)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--border-radius)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '600',
                  }}>
                    +{extra.percentage}%
                  </span>
                )}
              </div>

              {extra.reduces_delivery_days && (
                <span className="badge badge-success">
                  Reduce entrega
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Catalog;
