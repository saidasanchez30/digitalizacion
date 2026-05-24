import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApiMutation } from '../hooks/useApi';
import { getOrderById, cancelOrder } from '../api/api';
import StatusTimeline from '../components/StatusTimeline';
import StatusBadge from '../components/StatusBadge';
import { formatDateTime } from '../utils/formatters';
import { getOrderStatusLabel, getPaymentStatusLabel } from '../utils/statusLabels';

function Tracking() {
  const [searchParams]          = useSearchParams();
  const [orderId, setOrderId]   = useState(searchParams.get('order') ?? '');
  const [order, setOrder]       = useState(null);
  const [fetchErr, setFetchErr] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [cancelDone, setCancelDone] = useState(false);

  const { execute: doCancel, loading: cancelling, error: cancelErr } = useApiMutation(cancelOrder);

  const fetchOrder = async (id = orderId) => {
    if (!id?.toString().trim()) return;
    setFetching(true); setFetchErr(null); setOrder(null); setCancelDone(false);
    try {
      const res = await getOrderById(id.toString().trim());
      setOrder(res.data);
    } catch (err) {
      setFetchErr(err?.response?.data?.detail ?? 'No encontramos la orden. Verifica el ID e intenta de nuevo.');
    } finally {
      setFetching(false);
    }
  };

  /* Auto-fetch if order param in URL */
  useEffect(() => {
    const id = searchParams.get('order');
    if (id) fetchOrder(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async () => {
    if (!window.confirm('¿Confirmas que deseas cancelar esta orden? Esta acción no se puede deshacer.')) return;
    const updated = await doCancel(order.id);
    setOrder(updated);
    setCancelDone(true);
  };

  const canCancel = order?.order_status === 'pickup_scheduled';
  const isVault   = order?.order_status === 'available_in_vault';
  const isPremium = order?.quotation?.service?.is_premium;

  return (
    <div className="page-wrapper tracking-page">
      <div className="page-header">
        <div className="container">
          <h1>Seguimiento de orden</h1>
          <p>Consulta el estado actual de tu digitalización en tiempo real.</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 900, paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>

        {/* Search */}
        <div className="card card-body-lg" style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
            🔍 Buscar orden
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Ingresa el ID de tu orden (ej. 42)"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchOrder()}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary btn-lg"
              onClick={() => fetchOrder()}
              disabled={fetching || !orderId.toString().trim()}
              style={{ flexShrink: 0 }}
            >
              {fetching
                ? <><div className="spinner spinner-sm" style={{ marginRight: 6 }} />Buscando...</>
                : 'Buscar'}
            </button>
          </div>
          <p className="form-hint" style={{ marginTop: 'var(--space-3)' }}>
            💡 El ID de orden lo recibiste al confirmar tu pago. También puedes consultarlo en tu correo de confirmación.
          </p>
        </div>

        {/* Error */}
        {fetchErr && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)', animation: 'fadeIn 0.3s ease' }}>
            <span className="alert-icon">❌</span>
            <div><strong>Orden no encontrada</strong><br />{fetchErr}</div>
          </div>
        )}

        {/* Order detail */}
        {order && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            {/* Info card */}
            <div className="card card-body-lg" style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                    <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: '-0.03em' }}>
                      Orden #{order.id}
                    </h2>
                    {isPremium && <span className="badge badge-premium">⭐ Premium</span>}
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                    Creada el {formatDateTime(order.created_at)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <StatusBadge status={order.order_status}   type="order" />
                  <StatusBadge status={order.payment_status} type="payment" />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
                {[
                  { label: 'Estado de orden',   value: getOrderStatusLabel(order.order_status) },
                  { label: 'Estado de pago',     value: getPaymentStatusLabel(order.payment_status) },
                  { label: 'Método de pago',     value: order.payment_method },
                  { label: 'Cotización base',    value: `#${order.quotation_id}` },
                ].map(({ label, value }) => (
                  <div key={label} className="info-box">
                    <span className="info-box-label">{label}</span>
                    <span className="info-box-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="card card-body-lg" style={{ marginBottom: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                📍 Progreso del servicio
              </h3>
              <StatusTimeline currentStatus={order.order_status} />
            </div>

            {/* Actions */}
            {cancelDone && (
              <div className="alert alert-warning" style={{ marginBottom: 'var(--space-6)', animation: 'fadeIn 0.3s ease' }}>
                <span className="alert-icon">🔔</span>
                <div><strong>Orden cancelada.</strong> Se iniciará el proceso de reembolso en los próximos días hábiles.</div>
              </div>
            )}

            {cancelErr && (
              <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)' }}>
                <span className="alert-icon">❌</span>
                <div><strong>Error al cancelar</strong><br />{cancelErr}</div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              {canCancel && (
                <button
                  className="btn btn-danger btn-lg"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling
                    ? <><div className="spinner spinner-sm" style={{ marginRight: 6 }} />Cancelando...</>
                    : '🚫 Cancelar orden'}
                </button>
              )}

              {(isVault || isPremium) && (
                <Link to={`/vault?order=${order.id}`} className="btn btn-primary btn-lg">
                  🔐 Acceder a la bóveda →
                </Link>
              )}

              <button
                className="btn btn-ghost btn-lg"
                onClick={() => { setOrder(null); setOrderId(''); setFetchErr(null); }}
              >
                Buscar otra orden
              </button>
            </div>

            {canCancel && (
              <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                ⚠ Solo puedes cancelar mientras el estado sea "Recolección agendada". Una vez recojamos los documentos, no es posible cancelar.
              </p>
            )}
          </div>
        )}

        {/* Empty state */}
        {!order && !fetchErr && !fetching && (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>Ingresa el ID de tu orden</h3>
            <p>Consulta el estado actual, el progreso en tiempo real y accede a tu bóveda digital si aplica.</p>
          </div>
        )}
      </div>

      <style>{`
        .info-box {
          display: flex; flex-direction: column; gap: var(--space-1);
          padding: var(--space-4); background: var(--navy-50);
          border: 1px solid var(--color-border); border-radius: var(--radius-lg);
        }
        .info-box-label { font-size: var(--text-xs); color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .info-box-value { font-size: var(--text-sm); font-weight: 700; color: var(--color-text-primary); }
      `}</style>
    </div>
  );
}

export default Tracking;
