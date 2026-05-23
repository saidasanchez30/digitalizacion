import React, { useState } from 'react';
import { getOrderById, updateOrderStatus, getQuotationById, getServices } from '../api/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';
import { formatDateTime } from '../utils/formatters';

function AdminDemo() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [quotation, setQuotation] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const statusTransitions = [
    { value: 'documents_collected', label: '📦 Documentos recolectados' },
    { value: 'digitizing', label: '🔄 En digitalización' },
    { value: 'quality_review', label: '✅ Revisión de calidad' },
    { value: 'preparing_delivery', label: '📬 Preparando entrega' },
    { value: 'delivered', label: '📬 Entregado' },
    { value: 'available_in_vault', label: '🔒 Disponible en bóveda' },
  ];

  const isPremiumOrder = service?.is_premium === true;

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError('Por favor ingresa un ID de orden');
      return;
    }

    try {
      setLoading(true);

      const orderData = await getOrderById(parseInt(orderId, 10));
      setOrder(orderData);

      const quotationData = await getQuotationById(orderData.quotation_id);
      setQuotation(quotationData);

      const servicesData = await getServices();
      const selectedService = servicesData.find(
        (item) => item.id === quotationData.service_id
      );

      setService(selectedService || null);

      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Orden no encontrada'
      );
      setOrder(null);
      setQuotation(null);
      setService(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!window.confirm(`¿Cambiar estado a: ${newStatus}?`)) {
      return;
    }

    try {
      setUpdating(true);

      await updateOrderStatus(parseInt(orderId, 10), { order_status: newStatus });

      const orderData = await getOrderById(parseInt(orderId, 10));
      setOrder(orderData);

      const quotationData = await getQuotationById(orderData.quotation_id);
      setQuotation(quotationData);

      const servicesData = await getServices();
      const selectedService = servicesData.find(
        (item) => item.id === quotationData.service_id
      );

      setService(selectedService || null);

      setError(null);
    } catch (err) {
      setError('Error al actualizar estado: ' + (err.response?.data?.detail || err.message));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className="alert alert-warning" style={{ marginBottom: 'var(--space-2xl)' }}>
        <h3>⚙️ Panel de administración</h3>
        <p>Esta pantalla permite cambiar el estado de las órdenes para ver el progreso del servicio.</p>
      </div>

      <h1 style={{ marginBottom: 'var(--space-lg)' }}>Administración de órdenes</h1>

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
          placeholder="Ingresa ID de orden"
          className="form-input"
          min="1"
        />
        <button type="submit" className="btn btn-primary btn-lg">
          Cargar orden
        </button>
      </form>

      {error && !loading && <ErrorMessage title="Error" message={error} />}
      {loading && <Loading message="Cargando orden..." />}

      {/* Detalles de orden y controles */}
      {order && (
        <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
          {/* Información general */}
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Detalles de la orden</h3>

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
                  Tipo de plan
                </div>

                {service ? (
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '999px',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: '700',
                        backgroundColor: service.is_premium ? '#ede9fe' : '#e0f2fe',
                        color: service.is_premium ? '#5b21b6' : '#075985',
                        textTransform: 'uppercase',
                      }}
                    >
                      {service.is_premium ? 'Plan Premium' : 'Plan Estándar'}
                    </span>
                    
                  </div>
                ) : (
                  <div style={{ fontWeight: '600' }}>No disponible</div>
                )}
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
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Progreso actual</h3>
              <StatusTimeline currentStatus={order.order_status} />
            </div>
          )}

          {/* Controles de estado */}
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Cambiar estado de la orden</h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-lg)',
            }}>
              {statusTransitions.map((status) => (
                <button
                  key={status.value}
                  className="btn btn-secondary"
                  onClick={() => handleUpdateStatus(status.value)}
                  disabled={
                    updating ||
                    order.order_status === status.value ||
                    (status.value === 'available_in_vault' && !isPremiumOrder)
                  }
                  style={{
                    opacity:
                      order.order_status === status.value ||
                      (status.value === 'available_in_vault' && !isPremiumOrder)
                        ? 0.5
                        : 1,
                    cursor:
                      order.order_status === status.value ||
                      (status.value === 'available_in_vault' && !isPremiumOrder)
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  {status.value === 'available_in_vault' && !isPremiumOrder
                    ? '🔒 Bóveda solo Premium'
                    : status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Acción de limpiar */}
          <button
            className="btn btn-outline"
            onClick={() => {
              setOrder(null);
              setQuotation(null);
              setService(null);
              setOrderId('');
              setError(null);
            }}
          >
            Cargar otra orden
          </button>
        </div>
      )}

      {/* Información de ayuda */}
      <div className="card" style={{ marginTop: 'var(--space-2xl)', backgroundColor: 'var(--color-bg)' }}>
        <h4 style={{ marginBottom: 'var(--space-md)' }}>💡 Guía de uso</h4>
        <ol style={{ paddingLeft: '1.5rem', color: 'var(--color-text-light)' }}>
          <li style={{ marginBottom: 'var(--space-sm)' }}>Ingresa el ID de una orden existente</li>
          <li style={{ marginBottom: 'var(--space-sm)' }}>Haz clic en cualquier botón de estado para cambiar el progreso</li>
          <li style={{ marginBottom: 'var(--space-sm)' }}>El estado actual se mostrará en gris y estará deshabilitado</li>
          <li>Usa esta funcionalidad para presentar diferentes escenarios</li>
        </ol>
      </div>
    </div>
  );
}

export default AdminDemo;
