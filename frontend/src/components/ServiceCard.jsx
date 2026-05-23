import React from 'react';
import { formatCurrency } from '../utils/formatters';

function ServiceCard({ service, onSelectService }) {
  const isPremium = service.is_premium;

  return (
    <div className="card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'var(--space-md)',
      borderTop: isPremium ? '4px solid #6366f1' : '4px solid #1a3a52'
    }}>
      <div>
        <h3>{service.name}</h3>
        {isPremium && (
          <span className="badge badge-info" style={{ marginTop: '0.5rem' }}>
            Incluye Bóveda Digital
          </span>
        )}
      </div>

      <p style={{ 
        color: 'var(--color-text-light)', 
        fontSize: 'var(--font-size-base)' 
      }}>
        {service.description}
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-md)',
        padding: 'var(--space-md)',
        backgroundColor: 'var(--color-bg)',
        borderRadius: 'var(--border-radius)',
      }}>
        <div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
            Por 1,000 hojas
          </div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: 'var(--color-primary)' }}>
            {formatCurrency(service.price_per_1000_pages)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
            Días estimados
          </div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: 'var(--color-secondary)' }}>
            {service.estimated_days}
          </div>
        </div>
      </div>

      {onSelectService && (
        <button 
          className="btn btn-secondary btn-lg" 
          onClick={() => onSelectService(service.id)}
          style={{ width: '100%' }}
        >
          Cotizar este plan
        </button>
      )}
    </div>
  );
}

export default ServiceCard;
