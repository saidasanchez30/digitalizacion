import {
  getOrderStatusLabel, getOrderStatusColor,
  getPaymentStatusLabel, getPaymentStatusColor,
} from '../utils/statusLabels';

function StatusBadge({ status, type = 'order' }) {
  const label = type === 'order'
    ? getOrderStatusLabel(status)
    : type === 'payment'
      ? getPaymentStatusLabel(status)
      : status;

  const color = type === 'order'
    ? getOrderStatusColor(status)
    : type === 'payment'
      ? getPaymentStatusColor(status)
      : '#6b7280';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--text-xs)',
      fontWeight: 700,
      letterSpacing: '0.04em',
      backgroundColor: `${color}18`,
      color: color,
      border: `1px solid ${color}30`,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

export default StatusBadge;
