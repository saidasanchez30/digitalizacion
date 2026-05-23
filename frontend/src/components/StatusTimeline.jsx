import React from 'react';
import {
  orderStatusSequence,
  getOrderStatusLabel,
  getOrderStatusColor,
} from '../utils/statusLabels';

function StatusTimeline({ currentStatus }) {
  const currentIndex = orderStatusSequence.indexOf(currentStatus);

  if (currentStatus === 'cancelled') {
    return (
      <div className="alert alert-error">
        <h3>Servicio cancelado</h3>
        <p>Esta orden fue cancelada antes de iniciar o completar el proceso.</p>
      </div>
    );
  }

  if (currentStatus === 'available_in_vault') {
    return (
      <div>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#ecfeff',
            border: '1px solid #a5f3fc',
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--space-lg)',
          }}
        >
          <strong style={{ color: '#0e7490' }}>
            Documentos disponibles en bóveda digital
          </strong>
          <p style={{ margin: '0.5rem 0 0', color: '#155e75' }}>
            La orden ya cuenta con documentos clasificados y disponibles para consulta.
          </p>
        </div>

        <TimelineSteps currentIndex={orderStatusSequence.length - 1} />
      </div>
    );
  }

  if (currentIndex === -1) {
    return (
      <div className="alert alert-info">
        <h3>Estado no reconocido</h3>
        <p>Estado actual recibido: {currentStatus}</p>
      </div>
    );
  }

  return <TimelineSteps currentIndex={currentIndex} />;
}

function TimelineSteps({ currentIndex }) {
  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${orderStatusSequence.length}, minmax(130px, 1fr))`,
          gap: '0.75rem',
          minWidth: '760px',
        }}
      >
        {orderStatusSequence.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;
          const color = getOrderStatusColor(status);

          return (
            <div
              key={status}
              style={{
                position: 'relative',
                padding: '1rem 0.75rem',
                borderRadius: '14px',
                border: isCurrent
                  ? `2px solid ${color}`
                  : '1px solid var(--color-border)',
                backgroundColor: isCompleted
                  ? `${color}12`
                  : isCurrent
                    ? `${color}18`
                    : '#f8fafc',
                textAlign: 'center',
                minHeight: '120px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  margin: '0 auto 0.75rem',
                  backgroundColor: isCompleted || isCurrent ? color : '#e2e8f0',
                  color: isCompleted || isCurrent ? 'white' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1rem',
                }}
              >
                {isCompleted ? '✓' : isCurrent ? '●' : index + 1}
              </div>

              <div
                style={{
                  fontWeight: isCurrent ? '800' : '700',
                  color: isPending ? '#64748b' : '#0f172a',
                  fontSize: '0.9rem',
                  lineHeight: '1.3',
                }}
              >
                {getOrderStatusLabel(status)}
              </div>

              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: isCompleted
                    ? color
                    : isCurrent
                      ? color
                      : '#94a3b8',
                  fontWeight: '600',
                }}
              >
                {isCompleted && 'Completado'}
                {isCurrent && 'Estado actual'}
                {isPending && 'Pendiente'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatusTimeline;