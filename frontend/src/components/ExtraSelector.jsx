import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

function ExtraSelector({ extras = [], selectedExtras = [], onToggleExtra }) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 'var(--space-lg)',
    }}>
      {extras.map((extra) => (
        <div 
          key={extra.id}
          style={{
            padding: 'var(--space-lg)',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            backgroundColor: selectedExtras.includes(extra.id) ? 'rgba(99, 102, 241, 0.05)' : 'var(--color-white)',
            borderColor: selectedExtras.includes(extra.id) ? '#6366f1' : 'var(--color-border)',
            transition: 'all 0.2s ease',
          }}
          onClick={() => onToggleExtra && onToggleExtra(extra.id)}
        >
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
            <input 
              type="checkbox" 
              checked={selectedExtras.includes(extra.id)}
              onChange={() => {}}
              style={{ marginTop: '0.25rem', cursor: 'pointer' }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: '0.5rem' }}>{extra.name}</h4>
              <p style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: 'var(--color-text-light)',
                marginBottom: 'var(--space-sm)'
              }}>
                {extra.description}
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-lg)', fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>
                {extra.price > 0 && (
                  <span style={{ color: 'var(--color-success)' }}>
                    {formatCurrency(extra.price)}
                  </span>
                )}
                {extra.percentage > 0 && (
                  <span style={{ color: 'var(--color-warning)' }}>
                    +{formatPercentage(extra.percentage)}
                  </span>
                )}
              </div>
              {extra.reduces_delivery_days && (
                <span className="badge badge-success" style={{ marginTop: 'var(--space-sm)' }}>
                  Reduce entrega
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExtraSelector;
