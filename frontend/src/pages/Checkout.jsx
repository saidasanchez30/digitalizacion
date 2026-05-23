import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuotationById, postOrder } from '../api/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import { validateCheckoutForm } from '../utils/validation';

function Checkout() {
  const { quotationId } = useParams();
  const navigate = useNavigate();

  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderCreated, setOrderCreated] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentError, setPaymentError] = useState(null);

  const paymentMethods = [
    { value: 'Tarjeta', label: 'Tarjeta de crédito o débito' },
    { value: 'Transferencia bancaria', label: 'Transferencia bancaria' },
    { value: 'Pago contra entrega', label: 'Pago contra entrega' },
    { value: 'Orden de compra empresarial', label: 'Orden de compra empresarial' },
  ];

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const data = await getQuotationById(quotationId);
        setQuotation(data);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          err.message ||
          'Error al cargar la cotización'
        );
      } finally {
        setLoading(false);
      }
    };

    if (quotationId) {
      fetchQuotation();
    } else {
      setError('ID de cotización inválido');
      setLoading(false);
    }
  }, [quotationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar
    const { isValid, errors } = validateCheckoutForm({ payment_method: paymentMethod });
    if (!isValid) {
      setPaymentError(errors.payment_method);
      return;
    }

    try {
      setSubmitting(true);
      const response = await postOrder({
        quotation_id: parseInt(quotationId),
        payment_method: paymentMethod,
      });
      setOrderCreated(response);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al crear la orden');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Cargando cotización..." />;
  if (error && !orderCreated) return <ErrorMessage title="Error" message={error} />;

  // Si la orden fue creada exitosamente
  if (orderCreated) {
    return (
      <div>
        <div className="alert alert-success">
          <h3>✓ Orden creada exitosamente</h3>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 style={{ marginBottom: 'var(--space-lg)' }}>Confirmación de orden</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-lg)',
            marginBottom: 'var(--space-lg)',
          }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
                ID de orden
              </div>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', color: 'var(--color-secondary)' }}>
                #{orderCreated.id}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
                Estado de orden
              </div>
              <div style={{ marginTop: 'var(--space-sm)' }}>
                <StatusBadge status={orderCreated.order_status} type="order" />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
                Estado de pago
              </div>
              <div style={{ marginTop: 'var(--space-sm)' }}>
                <StatusBadge status={orderCreated.payment_status} type="payment" />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
                Método de pago
              </div>
              <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600', marginTop: 'var(--space-sm)' }}>
                {orderCreated.payment_method}
              </div>
            </div>
          </div>

          <div style={{
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--border-radius)',
            marginBottom: 'var(--space-lg)',
          }}>
            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Resumen de cotización</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 'var(--space-lg)',
            }}>
              <div>Subtotal</div>
              <div>{formatCurrency(quotation.subtotal)}</div>

              {quotation.extras_total > 0 && (
                <>
                  <div>Extras</div>
                  <div>{formatCurrency(quotation.extras_total)}</div>
                </>
              )}

              <div style={{
                gridColumn: '1 / -1',
                borderTop: '2px solid var(--color-border)',
                paddingTop: 'var(--space-lg)',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 'var(--space-lg)',
              }}>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700' }}>
                  Total a pagar
                </div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-secondary)' }}>
                  {formatCurrency(quotation.total)}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-lg)',
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--border-radius)',
          }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)' }}>
                Fecha de recolección
              </div>
              <div style={{ fontWeight: '600' }}>
                {formatDate(quotation.pickup_date)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)' }}>
                Fecha estimada de entrega
              </div>
              <div style={{ fontWeight: '600' }}>
                {formatDate(quotation.estimated_delivery_date)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)', marginBottom: 'var(--space-sm)' }}>
                Método de entrega
              </div>
              <div style={{ fontWeight: '600' }}>
                {quotation.delivery_method}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/tracking')}
          >
            Ver seguimiento
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return <ErrorMessage title="Error" message="No se pudo cargar la cotización" />;
  }

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-lg)' }}>Confirmar compra</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-lg)',
        marginBottom: 'var(--space-2xl)',
      }}>
        {/* Resumen de cotización */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Resumen de cotización</h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: 'var(--space-lg)',
          }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
                Empresa
              </div>
              <div style={{ fontWeight: '600' }}>{quotation.company_name}</div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
                Contacto
              </div>
              <div style={{ fontWeight: '600' }}>{quotation.contact_name}</div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: 'var(--space-lg)',
          }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
                Fecha recolección
              </div>
              <div style={{ fontWeight: '600' }}>{formatDate(quotation.pickup_date)}</div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>
                Fecha entrega
              </div>
              <div style={{ fontWeight: '600' }}>{formatDate(quotation.estimated_delivery_date)}</div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: 'var(--space-lg)',
          }}>
            <div>Subtotal</div>
            <div style={{ fontWeight: '600' }}>{formatCurrency(quotation.subtotal)}</div>

            {quotation.extras_total > 0 && (
              <>
                <div>Extras</div>
                <div style={{ fontWeight: '600' }}>{formatCurrency(quotation.extras_total)}</div>
              </>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 'var(--space-md)',
          }}>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700' }}>Total</div>
            <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: '700', color: 'var(--color-secondary)' }}>
              {formatCurrency(quotation.total)}
            </div>
          </div>
        </div>

        {/* Selección de método de pago */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Método de pago</h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div>
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  style={{
                    display: 'block',
                    padding: 'var(--space-md)',
                    marginBottom: 'var(--space-sm)',
                    border: '2px solid var(--color-border)',
                    borderRadius: 'var(--border-radius)',
                    cursor: 'pointer',
                    backgroundColor: paymentMethod === method.value ? 'rgba(99, 102, 241, 0.05)' : 'var(--color-white)',
                    borderColor: paymentMethod === method.value ? '#6366f1' : 'var(--color-border)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentError(null);
                    }}
                    style={{ marginRight: 'var(--space-md)', cursor: 'pointer' }}
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>

            {paymentError && <div className="form-error">{paymentError}</div>}

            <button
              type="submit"
              className="btn btn-secondary btn-lg"
              disabled={submitting}
              style={{ width: '100%' }}
            >
              {submitting ? 'Procesando...' : 'Confirmar pago'}
            </button>
          </form>
        </div>
      </div>

      <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--font-size-sm)' }}>
        💡 Este es un sistema de pago simulado. No se procesará ninguna transacción real.
      </p>
    </div>
  );
}

export default Checkout;
