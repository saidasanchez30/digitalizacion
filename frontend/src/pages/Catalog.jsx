import { useNavigate } from 'react-router-dom';
import { useApiGet } from '../hooks/useApi';
import { getServices, getExtras } from '../api/api';
import ServiceCard from '../components/ServiceCard';
import { formatCurrency } from '../utils/formatters';

function ExtraCard({ extra }) {
  return (
    <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <div className="extra-card-icon">
          {extra.reduces_delivery_days ? '⚡' : extra.price > 0 ? '📦' : '📊'}
        </div>
        {extra.reduces_delivery_days && (
          <span className="badge badge-success">Entrega más rápida</span>
        )}
      </div>
      <div>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
          {extra.name}
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
          {extra.description}
        </p>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        {extra.price > 0 && (
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-success)' }}>
            +{formatCurrency(extra.price)}
          </span>
        )}
        {extra.percentage > 0 && (
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--amber-500)' }}>
            +{extra.percentage}% s/subtotal
          </span>
        )}
      </div>
    </div>
  );
}

function Catalog() {
  const navigate = useNavigate();

  const { data: services, loading: svcLoad, error: svcErr } = useApiGet(getServices);
  const { data: extras,   loading: extLoad, error: extErr } = useApiGet(getExtras);

  const handleSelectService = (serviceId) => {
    navigate(`/quotation?service=${serviceId}`);
  };

  return (
    <div className="page-wrapper catalog-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>Catálogo de servicios</h1>
          <p>Planes y servicios adicionales diseñados para cada tipo de empresa. Transparencia total en precios.</p>
        </div>
      </div>

      {/* Plans */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="pill pill-brand" style={{ margin: '0 auto var(--space-4)', width: 'fit-content' }}>
              Planes de digitalización
            </div>
            <h2 className="section-title">Elige tu plan</h2>
            <p className="section-subtitle">
              Dos planes diseñados para cubrir desde proyectos puntuales hasta digitalizaciones masivas con almacenamiento seguro.
            </p>
          </div>

          {svcLoad && <div className="spinner-wrapper"><div className="spinner" /></div>}

          {svcErr && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <div><strong>Error al cargar servicios</strong><br />{svcErr}</div>
            </div>
          )}

          {services && (
            <div className="grid grid-2" style={{ maxWidth: 900, margin: '0 auto', gap: 'var(--space-8)' }}>
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelectService={handleSelectService}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Extras */}
      <section className="section" style={{ background: 'var(--navy-50)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="pill pill-brand" style={{ margin: '0 auto var(--space-4)', width: 'fit-content' }}>
              Servicios adicionales
            </div>
            <h2 className="section-title">Potencia tu digitalización</h2>
            <p className="section-subtitle">
              Complementa tu plan con servicios adicionales. Se aplican sobre cualquier plan al momento de cotizar.
            </p>
          </div>

          {extLoad && <div className="spinner-wrapper"><div className="spinner" /></div>}

          {extErr && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <div><strong>Error al cargar extras</strong><br />{extErr}</div>
            </div>
          )}

          {extras && (
            <div className="grid grid-3">
              {extras.map(extra => <ExtraCard key={extra.id} extra={extra} />)}
            </div>
          )}
        </div>
      </section>

      {/* FAQ-style trust block */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="section-header">
            <h2 className="section-title">Preguntas frecuentes</h2>
          </div>

          {[
            { q: '¿Qué sucede si tengo más páginas de las estimadas?',         a: 'Ajustamos el precio al número real de páginas procesadas. Siempre te notificamos antes de proceder si hay diferencia significativa.' },
            { q: '¿Puedo cancelar mi orden una vez confirmada?',                a: 'Puedes cancelar sin costo hasta antes de que realicemos la recolección de tus documentos. Después, no aplican reembolsos.' },
            { q: '¿Cómo garantizan la seguridad de mis documentos?',           a: 'Utilizamos transporte especializado, instalaciones con acceso controlado y eliminamos físicamente los documentos solo con tu autorización escrita.' },
            { q: '¿Qué formatos de salida entregan?',                           a: 'Entregamos en PDF/A (archivístico), TIFF de alta resolución y, con el complemento OCR, en formatos buscables como PDF con texto seleccionable.' },
          ].map(({ q, a }) => (
            <div key={q} className="faq-item">
              <h4 className="faq-question">❓ {q}</h4>
              <p className="faq-answer">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .extra-card-icon {
          width: 44px; height: 44px; border-radius: var(--radius-lg);
          background: var(--indigo-100); display: flex; align-items: center;
          justify-content: center; font-size: var(--text-2xl);
        }
        .faq-item {
          padding: var(--space-6);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-4);
          transition: box-shadow var(--ease-base);
        }
        .faq-item:hover { box-shadow: var(--shadow-md); }
        .faq-question {
          font-size: var(--text-base); font-weight: var(--font-semibold);
          color: var(--color-text-primary); margin-bottom: var(--space-3);
        }
        .faq-answer {
          font-size: var(--text-sm); color: var(--color-text-secondary);
          line-height: var(--leading-relaxed);
        }
      `}</style>
    </div>
  );
}

export default Catalog;
