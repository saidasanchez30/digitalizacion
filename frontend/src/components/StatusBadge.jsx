import React from 'react';
import { getOrderStatusLabel, getOrderStatusColor, getPaymentStatusLabel, getPaymentStatusColor } from '../utils/statusLabels';

function StatusBadge({ status, type = 'order' }) {
  let label, color;

  if (type === 'order') {
    label = getOrderStatusLabel(status);
    color = getOrderStatusColor(status);
  } else if (type === 'payment') {
    label = getPaymentStatusLabel(status);
    color = getPaymentStatusColor(status);
  } else {
    label = status;
    color = '#6b7280';
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: 'var(--border-radius)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: '600',
        backgroundColor: `${color}15`,
        color: color,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
