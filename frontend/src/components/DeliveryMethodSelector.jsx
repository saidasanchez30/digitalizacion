import React from 'react';

function DeliveryMethodSelector({ 
  selectedMethod = '', 
  onSelect, 
  isPremium = false 
}) {
  // Métodos disponibles según el plan
  const standardMethods = [
    { value: 'Unidad física del cliente', label: 'Unidad física proporcionada por el cliente' },
    { value: 'Enlace temporal a nuestra nube', label: 'Enlace temporal a nuestra nube' },
    { value: 'Transferencia a la nube del cliente', label: 'Transferencia a la nube del cliente' },
    { value: 'Servidor SFTP', label: 'Servidor SFTP' },
  ];

  const premiumMethods = [
    ...standardMethods,
    { value: 'Bóveda Digital Segura', label: 'Bóveda Digital Segura (incluida)' },
  ];

  const methods = isPremium ? premiumMethods : standardMethods;

  return (
    <div>
      {methods.map((method) => (
        <label 
          key={method.value}
          style={{
            display: 'block',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-sm)',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            backgroundColor: selectedMethod === method.value ? 'rgba(99, 102, 241, 0.05)' : 'var(--color-white)',
            borderColor: selectedMethod === method.value ? '#6366f1' : 'var(--color-border)',
            transition: 'all 0.2s ease',
          }}
        >
          <input 
            type="radio" 
            name="delivery_method"
            value={method.value}
            checked={selectedMethod === method.value}
            onChange={(e) => onSelect && onSelect(e.target.value)}
            style={{ marginRight: 'var(--space-md)', cursor: 'pointer' }}
          />
          <span>{method.label}</span>
        </label>
      ))}
    </div>
  );
}

export default DeliveryMethodSelector;
