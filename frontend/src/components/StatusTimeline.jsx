import { orderStatusSequence, getOrderStatusLabel } from '../utils/statusLabels';

const STEP_ICONS = {
  pickup_scheduled:    '📅',
  documents_collected: '📦',
  digitizing:          '⚡',
  quality_review:      '🔍',
  preparing_delivery:  '🚚',
  delivered:           '✅',
};

function StatusTimeline({ currentStatus }) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="alert alert-error">
        <span className="alert-icon">🚫</span>
        <div>
          <strong>Orden cancelada</strong><br />
          Esta orden fue cancelada antes de que iniciara el proceso de digitalización.
        </div>
      </div>
    );
  }

  const isVault    = currentStatus === 'available_in_vault';
  const currentIdx = isVault
    ? orderStatusSequence.length - 1
    : orderStatusSequence.indexOf(currentStatus);

  return (
    <div>
      {isVault && (
        <div className="alert alert-info" style={{ marginBottom: 'var(--space-6)' }}>
          <span className="alert-icon">🔐</span>
          <div>
            <strong>Documentos disponibles en Bóveda Digital</strong><br />
            Los archivos ya están clasificados e indexados en tu bóveda segura.
          </div>
        </div>
      )}

      <div className="timeline-scroll">
        <div className="timeline-track">
          {orderStatusSequence.map((status, idx) => {
            const done    = idx < currentIdx;
            const current = idx === currentIdx;
            const pending = idx > currentIdx;

            return (
              <div key={status} className={`timeline-step${done ? ' done' : current ? ' current' : ' pending'}`}>
                {/* Connector line */}
                {idx > 0 && (
                  <div className={`timeline-connector${done || current ? ' filled' : ''}`} />
                )}

                {/* Circle */}
                <div className="timeline-circle">
                  {done    && <span className="tl-check">✓</span>}
                  {current && <span className="tl-icon">{STEP_ICONS[status] ?? '●'}</span>}
                  {pending && <span className="tl-num">{idx + 1}</span>}
                  {current && <span className="tl-pulse" />}
                </div>

                {/* Label */}
                <div className="timeline-label">
                  <span className="tl-status-name">{getOrderStatusLabel(status)}</span>
                  <span className="tl-status-hint">
                    {done ? 'Completado ✓' : current ? 'En progreso' : 'Pendiente'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .timeline-scroll { overflow-x: auto; padding-bottom: var(--space-4); }
        .timeline-track {
          display: flex;
          align-items: flex-start;
          min-width: 680px;
          padding: var(--space-6) 0;
          position: relative;
        }
        .timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
          gap: var(--space-3);
        }
        .timeline-connector {
          position: absolute;
          top: 22px;
          right: calc(50% + 22px);
          left: calc(-50% + 22px);
          height: 3px;
          background: var(--color-border);
          transition: background var(--ease-slow);
          z-index: 0;
        }
        .timeline-connector.filled { background: var(--color-success); }

        .timeline-circle {
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 1; flex-shrink: 0;
          border: 2.5px solid var(--color-border);
          background: var(--color-surface);
          transition: all var(--ease-base);
        }
        .timeline-step.done .timeline-circle {
          background: var(--color-success);
          border-color: var(--color-success);
        }
        .timeline-step.current .timeline-circle {
          background: var(--gradient-brand);
          border-color: var(--color-brand);
          box-shadow: var(--shadow-brand);
        }
        .tl-check { color: #fff; font-weight: 800; font-size: var(--text-base); }
        .tl-icon  { font-size: var(--text-lg); }
        .tl-num   { font-size: var(--text-sm); font-weight: 700; color: var(--color-text-muted); }
        .tl-pulse {
          position: absolute; inset: -4px; border-radius: 50%;
          border: 2px solid var(--color-brand); opacity: 0;
          animation: pulse-ring 2s ease infinite;
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.7; }
          70%  { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .timeline-label {
          display: flex; flex-direction: column; align-items: center;
          gap: var(--space-1); text-align: center;
        }
        .tl-status-name {
          font-size: var(--text-xs); font-weight: 700;
          color: var(--color-text-primary);
          line-height: var(--leading-snug);
        }
        .timeline-step.pending .tl-status-name { color: var(--color-text-muted); font-weight: 500; }
        .tl-status-hint {
          font-size: 10px; font-weight: 600;
          color: var(--color-text-muted); white-space: nowrap;
        }
        .timeline-step.done    .tl-status-hint { color: var(--color-success); }
        .timeline-step.current .tl-status-hint { color: var(--color-brand); }
      `}</style>
    </div>
  );
}

export default StatusTimeline;
