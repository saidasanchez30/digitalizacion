import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../api/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';
import { formatDate, formatDateTime, formatCurrency } from '../utils/formatters';

function Tracking() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError('Por favor ingresa un ID de orden');
      return;
    }

    try {
      setLoading(true);
      const data = await getOrderById(parseInt(orderId));
      setOrder(data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Orden no encontrada'
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('¿Estás seguro que deseas cancelar esta orden?')) {
      return;
    }

    try {
      setCancelling(true);
      await cancelOrder(parseInt(orderId));
      // Recargar orden
      const data = await getOrderById(parseInt(orderId));
      setOrder(data);
    } catch (err) {
      setError('Error al cancelar la orden');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = order && order.order_status === 'pickup_scheduled';
  const canViewVault = order && (order.order_status === 'delivered' || order.order_status === 'available_in_vault');

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-lg)' }}>Seguimiento de orden</h1>

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearch} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--space-lg)',
        marginBottom: 'var(--space-2xl)',
      }}>
        <input
          type="number"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Ingresa tu ID de orden"
          className="form-input"
          min="1"
        />
        <button type="submit" className="btn btn-primary btn-lg">
          Buscar orden
        </button>
      </form>

      {error && !loading && <ErrorMessage title="Error" message={error} />}
      {loading && <Loading message="Buscando orden..." />}

      {/* Resultados */}
      {order && (
        <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
          {/* Información general */}
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Información de la orden</h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--space-lg)',
            }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)' }}>
                  ID de orden
                </div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: 'var(--color-secondary)' }}>
                  #{order.id}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)' }}>
                  Estado de orden
                </div>
                <StatusBadge status={order.order_status} type="order" />
              </div>

              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)' }}>
                  Estado de pago
                </div>
                <StatusBadge status={order.payment_status} type="payment" />
              </div>

              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)' }}>
                  Fecha de creación
                </div>
                <div style={{ fontWeight: '600' }}>
                  {formatDateTime(order.created_at)}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)' }}>
                  Método de pago
                </div>
                <div style={{ fontWeight: '600' }}>
                  {order.payment_method}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline de progreso */}
          {order.order_status !== 'cancelled' && (
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Progreso del servicio</h3>
              <StatusTimeline currentStatus={order.order_status} />
            </div>
          )}

          {/* Mensaje si está cancelado */}
          {order.order_status === 'cancelled' && (
            <div className="alert alert-error">
              <h3>Orden cancelada</h3>
              <p>Esta orden ha sido cancelada. Si tienes preguntas, contacta con nuestro equipo de soporte.</p>
            </div>
          )}

          {/* Acciones */}
          <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
            {canCancel && (
              <button
                className="btn btn-danger"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelando...' : 'Cancelar orden'}
              </button>
            )}

            {canViewVault && (
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/vault')}
              >
                Ir a bóveda →
              </button>
            )}

            <button
              className="btn btn-outline"
              onClick={() => {
                setOrder(null);
                setOrderId('');
                setError(null);
              }}
            >
              Buscar otra orden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tracking;
