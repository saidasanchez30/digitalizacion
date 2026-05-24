import { useState } from 'react';
import { getOrderById, updateOrderStatus, getQuotationById, getServices } from '../api/api';
import StatusBadge    from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';
import { formatDateTime } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const STATUS_ACTIONS = [
  { value: 'documents_collected', label: '📦 Documentos recolectados' },
  { value: 'digitizing',          label: '⚡ En digitalización' },
  { value: 'quality_review',      label: '🔍 Revisión de calidad' },
  { value: 'preparing_delivery',  label: '🚚 Preparando entrega' },
  { value: 'delivered',           label: '✅ Entregado' },
  { value: 'available_in_vault',  label: '🔐 Disponible en bóveda', premiumOnly: true },
];

function AdminDemo() {
  const { currentUser, logout } = useAuth();
  const [orderId, setOrderId] = useState('');
  const [order,   setOrder]   = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [updating, setUpdating] = useState(false);

  const isPremium = service?.is_premium === true;

  const loadOrder = async (id = orderId) => {
    const clean = id.toString().trim();
    if (!clean) return;
    setLoading(true); setError(null); setOrder(null); setService(null);
    try {
      const ord  = await getOrderById(parseInt(clean, 10));
      const quot = await getQuotationById(ord.data.quotation_id);
      const svcs = await getServices();
      setOrder(ord.data);
      setService(svcs.data?.find(s => s.id === quot.data.service_id) ?? null);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.detail ?? 'Orden no encontrada');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (newStatus) => {
    if (!window.confirm(`¿Cambiar estado a "${newStatus}"?`)) return;
    setUpdating(true); setError(null);
    try {
      await updateOrderStatus(order.id, { order_status: newStatus });
      await loadOrder(order.id);
    } catch (err) {
      setError(err?.response?.data?.detail ?? 'Error al actualizar estado');
    } finally {
      setUpdating(false);
    }
  };

  const reset = () => { setOrder(null); setService(null); setOrderId(''); setError(null); };

  return (
    <div className="page-wrapper admin-page">
      {/* Admin topbar */}
      <div className="admin-topbar">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: 36, height: 36, background: 'var(--gradient-brand)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>⚙️</div>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Panel de administración</p>
              <p style={{ fontSize: 'var(--text-sm)', color: '#fff', fontWeight: 700 }}>DocDigitalPro</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.6)' }}>
              👤 {currentUser?.username}
            </span>
            <button
              className="btn btn-ghost-white btn-sm"
              onClick={logout}
            >
              Cerrar sesión →
            </button>
          </div>
        </div>
      </div>

      <div className="page-header" style={{ paddingTop: 'var(--space-10)' }}>
        <div className="container">
          <h1>Panel de administración</h1>
          <p>Simula cambios de estado para presentar el flujo completo del servicio.</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 960, paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>

        <div className="alert alert-warning" style={{ marginBottom: 'var(--space-8)' }}>
          <span className="alert-icon">⚠️</span>
          <div>
            <strong>Entorno de demostración</strong> — Los cambios de estado son permanentes en la base de datos.
            Úsalo solo para pruebas y presentaciones.
          </div>
        </div>

        {/* Search */}
        <div className="card card-body-lg" style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
            🔎 Cargar orden
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <input
              type="number" min={1}
              className="form-input"
              placeholder="ID de orden (ej. 1)"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadOrder()}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary btn-lg"
              onClick={() => loadOrder()}
              disabled={loading || !orderId.toString().trim()}
              style={{ flexShrink: 0 }}
            >
              {loading ? <><div className="spinner spinner-sm" style={{ marginRight: 6 }} />Cargando...</> : 'Cargar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-6)', animation: 'fadeIn 0.3s ease' }}>
            <span className="alert-icon">❌</span>
            <div><strong>Error</strong><br />{error}</div>
          </div>
        )}

        {order && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', animation: 'fadeIn 0.4s ease' }}>
            {/* Order info */}
            <div className="card card-body-lg">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>Orden #{order.id}</h3>
                {service && (
                  <span className={`badge ${isPremium ? 'badge-premium' : 'badge-brand'}`}>
                    {isPremium ? '⭐ Premium' : '📄 Estándar'}
                  </span>
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
                  <StatusBadge status={order.order_status}   type="order" />
                  <StatusBadge status={order.payment_status} type="payment" />
                </div>
              </div>

              <div className="grid grid-3" style={{ gap: 'var(--space-4)' }}>
                {[
                  { label: 'Cotización base', value: `#${order.quotation_id}` },
                  { label: 'Método de pago',  value: order.payment_method },
                  { label: 'Creada el',       value: formatDateTime(order.created_at) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: 'var(--space-4)', background: 'var(--navy-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                    <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {order.order_status !== 'cancelled' && (
              <div className="card card-body-lg">
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                  📍 Estado actual
                </h3>
                <StatusTimeline currentStatus={order.order_status} />
              </div>
            )}

            {/* Actions */}
            <div className="card card-body-lg">
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)', }}>
                ⚡ Cambiar estado
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
                Haz clic en un botón para simular el avance del proceso.
              </p>

              <div className="status-buttons">
                {STATUS_ACTIONS.map(action => {
                  const isDisabled = updating || order.order_status === action.value || (action.premiumOnly && !isPremium);
                  const isCurrent  = order.order_status === action.value;
                  return (
                    <button
                      key={action.value}
                      className={`btn ${isCurrent ? 'btn-success' : 'btn-outline'}`}
                      disabled={isDisabled}
                      onClick={() => handleUpdate(action.value)}
                      title={action.premiumOnly && !isPremium ? 'Solo disponible para Plan Premium' : ''}
                    >
                      {action.premiumOnly && !isPremium ? '🔒 Solo Premium' : action.label}
                      {isCurrent && ' ✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            <button className="btn btn-ghost btn-lg" onClick={reset} style={{ alignSelf: 'flex-start' }}>
              ← Cargar otra orden
            </button>
          </div>
        )}

        {!order && !error && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">⚙️</div>
            <h3>Ingresa el ID de una orden</h3>
            <p>Busca cualquier orden existente para ver su estado actual y simular el flujo del proceso de digitalización.</p>
          </div>
        )}

        {/* Guide */}
        <div className="card card-body" style={{ marginTop: 'var(--space-10)', background: 'var(--navy-50)' }}>
          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>💡 Guía de uso</h4>
          <ol style={{ paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            <li>Ingresa el ID de una orden existente y haz clic en "Cargar"</li>
            <li>Usa los botones para avanzar el estado del proceso</li>
            <li>El estado marcado en verde es el estado actual</li>
            <li>"Disponible en bóveda" solo aplica para órdenes con Plan Premium</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default AdminDemo;
