import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

const PLAN_FEATURES = {
  standard: [
    'Escaneo a alta resolución',
    'Control de calidad manual',
    'Unidad física o enlace de descarga',
    'Seguimiento de orden en línea',
  ],
  premium: [
    'Escaneo a alta resolución',
    'Control de calidad prioritario',
    'Todos los métodos de entrega',
    'Seguimiento en tiempo real',
    'Bóveda Digital encriptada 24/7',
    'OCR y búsqueda de texto incluido',
  ],
};

function ServiceCard({ service, onSelectService }) {
  const isPremium = service.is_premium;
  const features  = isPremium ? PLAN_FEATURES.premium : PLAN_FEATURES.standard;

  return (
    <div className={`service-card${isPremium ? ' service-card-premium' : ''}`}>
      {isPremium && <div className="service-card-ribbon">⭐ Más popular</div>}

      <div className="service-card-header">
        <div className="service-card-icon">{isPremium ? '🏆' : '📄'}</div>
        <div>
          <h3 className="service-card-name">Plan {service.name}</h3>
          {isPremium && <span className="badge badge-premium">Bóveda Digital incluida</span>}
        </div>
      </div>

      <p className="service-card-desc">{service.description}</p>

      <div className="service-card-pricing">
        <div className="service-card-price">
          <span className="price-value">{formatCurrency(service.price_per_1000_pages)}</span>
          <span className="price-unit">por 1,000 páginas</span>
        </div>
        <div className="service-card-days">
          <span className="days-value">{service.estimated_days}</span>
          <span className="days-unit">días hábiles</span>
        </div>
      </div>

      <ul className="service-card-features">
        {features.map(f => (
          <li key={f}>
            <span className="feature-check">✓</span>
            {f}
          </li>
        ))}
      </ul>

      {onSelectService ? (
        <button
          className={`btn btn-full btn-lg ${isPremium ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => onSelectService(service.id)}
        >
          Cotizar plan {service.name}
        </button>
      ) : (
        <Link
          to="/quotation"
          className={`btn btn-full btn-lg ${isPremium ? 'btn-primary' : 'btn-outline'}`}
        >
          Cotizar plan {service.name}
        </Link>
      )}

      <style>{`
        .service-card {
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
          position: relative;
          overflow: hidden;
          transition: box-shadow var(--ease-base), transform var(--ease-base);
        }
        .service-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }
        .service-card-premium {
          border-color: var(--indigo-400);
          background: linear-gradient(145deg, #fff 0%, var(--indigo-50) 100%);
          box-shadow: var(--shadow-brand);
        }
        .service-card-premium:hover { box-shadow: var(--shadow-brand-lg); }
        .service-card-ribbon {
          position: absolute; top: 20px; right: -28px;
          background: var(--gradient-brand); color: #fff;
          padding: 6px 40px; font-size: var(--text-xs); font-weight: 700;
          transform: rotate(45deg); white-space: nowrap;
          box-shadow: var(--shadow-brand);
        }
        .service-card-header {
          display: flex; align-items: center; gap: var(--space-4);
        }
        .service-card-icon {
          font-size: 2.25rem; width: 60px; height: 60px;
          display: flex; align-items: center; justify-content: center;
          background: var(--indigo-100); border-radius: var(--radius-lg); flex-shrink: 0;
        }
        .service-card-name {
          font-size: var(--text-xl); font-weight: 800; margin-bottom: var(--space-2);
        }
        .service-card-desc {
          font-size: var(--text-sm); color: var(--color-text-secondary);
          line-height: var(--leading-relaxed);
        }
        .service-card-pricing {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: var(--space-4); background: var(--navy-50);
          border: 1px solid var(--color-border); border-radius: var(--radius-lg);
          padding: var(--space-5);
        }
        .service-card-price, .service-card-days {
          display: flex; flex-direction: column; gap: var(--space-1);
        }
        .price-value {
          font-size: var(--text-2xl); font-weight: 800;
          color: var(--color-brand); letter-spacing: -0.03em;
        }
        .price-unit { font-size: var(--text-xs); color: var(--color-text-muted); }
        .days-value {
          font-size: var(--text-2xl); font-weight: 800;
          color: var(--navy-800); letter-spacing: -0.03em;
        }
        .days-unit { font-size: var(--text-xs); color: var(--color-text-muted); }
        .service-card-features {
          list-style: none; display: flex; flex-direction: column; gap: var(--space-3); flex: 1;
        }
        .service-card-features li {
          display: flex; align-items: center; gap: var(--space-3);
          font-size: var(--text-sm); color: var(--color-text-secondary);
        }
        .feature-check {
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--emerald-100); color: var(--emerald-600);
          display: flex; align-items: center; justify-content: center;
          font-size: var(--text-xs); font-weight: 700; flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

export default ServiceCard;
