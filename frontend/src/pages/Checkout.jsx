import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApiGet, useApiMutation } from '../hooks/useApi';
import { getQuotationById, postOrder } from '../api/api';
import { formatCurrency, formatDate, formatPages } from '../utils/formatters';

const PAYMENT_METHODS = [
  { value: 'credit_card',       icon: '💳', label: 'Tarjeta de crédito/débito',     desc: 'Visa, Mastercard, American Express' },
  { value: 'bank_transfer',     icon: '🏦', label: 'Transferencia bancaria',         desc: 'PSE · Nequi · Daviplata' },
  { value: 'cash_on_delivery',  icon: '💵', label: 'Pago contra entrega',            desc: 'Pago en efectivo al recibir los archivos' },
  { value: 'purchase_order',    icon: '📋', label: 'Orden de compra empresarial',    desc: 'Para empresas con crédito aprobado' },
];

const TRUST_ITEMS = [
  { icon: '🔒', text: 'Pago 100% seguro' },
  { icon: '🛡️', text: 'Datos encriptados' },
  { icon: '↩️', text: 'Cancelación gratuita' },
  { icon: '📞', text: 'Soporte 24/7' },
];

function Checkout() {
  const { quotationId } = useParams();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [confirmed, setConfirmed]         = useState(null);

  const { data: quotation, loading: qLoad, error: qErr } = useApiGet(
    () => getQuotationById(quotationId),
    [quotationId]
  );

  const { execute: createOrder, loading: ordering, error: orderErr } = useApiMutation(postOrder);

  const handleConfirm = async () => {
    if (!paymentMethod) return;
    try {
      const order = await createOrder({ quotation_id: Number(quotationId), payment_method: paymentMethod });
      setConfirmed(order);
    } catch (_) {}
  };

  /* ── Loading / Error ── */
  if (qLoad) return (
    <div className="page-wrapper">
      <div className="spinner-wrapper" style={{ minHeight: '60vh' }}><div className="spinner" /></div>
    </div>
  );

  if (qErr) return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 720, paddingTop: 'var(--space-12)' }}>
        <div className="alert alert-error">
          <span className="alert-icon">❌</span>
          <div><strong>No encontramos la cotización</strong><br />{qErr}</div>
        </div>
        <Link to="/quotation" className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }}>
          Crear nueva cotización
        </Link>
      </div>
    </div>
  );

  /* ── Success screen ── */
  if (confirmed) return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 720, paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-16)' }}>
        <div className="card card-body-lg" style={{ textAlign: 'center', animation: 'fadeInScale 0.4s ease' }}>
          <div style={{ fontSize: '5rem', marginBottom: 'var(--space-5)', animation: 'float 3s ease-in-out infinite' }}>✅</div>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-3)', letterSpacing: '-0.03em' }}>
            ¡Orden confirmada!
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)' }}>
            Tu orden <strong style={{ color: 'var(--color-brand)' }}>#{confirmed.id}</strong> ha sido registrada exitosamente.
            Nos pondremos en contacto para coordinar la recolección.
          </p>

          <div className="checkout-confirm-details">
            {[
              ['Estado de orden',   'Recolección programada 📅'],
              ['Estado de pago',    'Pago confirmado ✅'],
              ['Método de pago',    PAYMENT_METHODS.find(p => p.value === confirmed.payment_method)?.label ?? confirmed.payment_method],
              ['Fecha de orden',    formatDate(confirmed.created_at)],
            ].map(([k, v]) => (
              <div key={k} className="checkout-confirm-row">
                <span>{k}</span><strong>{v}</strong>
              </div>
            ))}
          </div>

          <div className="alert alert-info" style={{ marginTop: 'var(--space-6)', textAlign: 'left' }}>
            <span className="alert-icon">📧</span>
            <div>Recibirás un correo de confirmación con todos los detalles de tu orden.</div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-8)', flexWrap: 'wrap' }}>
            <Link to={`/tracking?order=${confirmed.id}`} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
              Seguir mi orden →
            </Link>
            <Link to="/" className="btn btn-outline btn-lg" style={{ flex: 1 }}>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
      <CheckoutStyles />
    </div>
  );

  /* ── Checkout form ── */
  return (
    <div className="page-wrapper checkout-page">
      <div className="page-header">
        <div className="container">
          <h1>Confirmar orden</h1>
          <p>Revisa el resumen de tu cotización y selecciona el método de pago.</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100, paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>
        <div className="checkout-layout">

          {/* Left: Payment */}
          <div className="checkout-main">
            {/* Trust badges */}
            <div className="trust-strip">
              {TRUST_ITEMS.map(t => (
                <div key={t.text} className="trust-item">
                  <span>{t.icon}</span><span>{t.text}</span>
                </div>
              ))}
            </div>

            <div className="card card-body-lg" style={{ marginTop: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                💳 Método de pago
              </h2>

              <div className="payment-methods">
                {PAYMENT_METHODS.map(method => (
                  <label
                    key={method.value}
                    className={`payment-method-option${paymentMethod === method.value ? ' selected' : ''}`}
                    onClick={() => setPaymentMethod(method.value)}
                  >
                    <div className="payment-method-icon">{method.icon}</div>
                    <div className="payment-method-info">
                      <strong>{method.label}</strong>
                      <span>{method.desc}</span>
                    </div>
                    <div className={`q-radio${paymentMethod === method.value ? ' q-radio-on' : ''}`} style={{ marginLeft: 'auto', flexShrink: 0 }}>
                      {paymentMethod === method.value && <div className="q-radio-dot" />}
                    </div>
                  </label>
                ))}
              </div>

              {!paymentMethod && (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
                  ⚠ Selecciona un método de pago para continuar
                </p>
              )}

              {orderErr && (
                <div className="alert alert-error" style={{ marginTop: 'var(--space-6)' }}>
                  <span className="alert-icon">❌</span>
                  <div><strong>Error al procesar</strong><br />{orderErr}</div>
                </div>
              )}

              <button
                className="btn btn-success btn-full btn-xl"
                style={{ marginTop: 'var(--space-8)' }}
                onClick={handleConfirm}
                disabled={!paymentMethod || ordering}
              >
                {ordering
                  ? <><div className="spinner spinner-sm" style={{ marginRight: 8 }} />Procesando...</>
                  : '🚀 Confirmar y ordenar'
                }
              </button>

              <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
                🔒 Transacción segura · Al confirmar aceptas nuestros Términos y Condiciones
              </p>
            </div>
          </div>

          {/* Right: Order summary */}
          {quotation && (
            <div className="checkout-summary">
              <div className="card card-body-lg">
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                  📄 Resumen de cotización #{quotation.id}
                </h3>

                <div className="summary-rows">
                  {[
                    ['Empresa',           quotation.company_name],
                    ['Contacto',          quotation.contact_name],
                    ['Páginas',           formatPages(quotation.estimated_pages)],
                    ['Recolección',       formatDate(quotation.pickup_date)],
                    ['Entrega estimada',  formatDate(quotation.estimated_delivery_date)],
                    ['Método entrega',    quotation.delivery_method],
                  ].map(([k, v]) => (
                    <div key={k} className="summary-row"><span>{k}</span><strong>{v}</strong></div>
                  ))}
                </div>

                <div className="divider" />

                <div className="summary-totals">
                  <div className="summary-row"><span>Subtotal digitalización</span><strong>{formatCurrency(quotation.subtotal)}</strong></div>
                  {quotation.extras_total > 0 && (
                    <div className="summary-row"><span>Servicios adicionales</span><strong>{formatCurrency(quotation.extras_total)}</strong></div>
                  )}
                  <div className="summary-row summary-total">
                    <span>Total</span>
                    <strong style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand)' }}>
                      {formatCurrency(quotation.total)}
                    </strong>
                  </div>
                </div>

                <div className="alert alert-success" style={{ marginTop: 'var(--space-5)' }}>
                  <span className="alert-icon">🏆</span>
                  <div style={{ fontSize: 'var(--text-xs)' }}>
                    Precio fijo garantizado. No hay cobros adicionales sorpresa.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CheckoutStyles />
    </div>
  );
}

function CheckoutStyles() {
  return (
    <style>{`
      .checkout-layout {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: var(--space-8);
        align-items: start;
      }
      .trust-strip {
        display: flex; gap: var(--space-6);
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: var(--radius-lg); padding: var(--space-4) var(--space-6);
        flex-wrap: wrap;
      }
      .trust-item { display:flex; align-items:center; gap:var(--space-2); font-size:var(--text-sm); font-weight:500; color:var(--color-text-secondary); }
      .summary-rows { display:flex; flex-direction:column; gap:0; }
      .summary-row {
        display:flex; justify-content:space-between; align-items:center;
        padding:var(--space-3) 0; border-bottom:1px solid var(--color-border-subtle);
        font-size:var(--text-sm);
      }
      .summary-row:last-child { border-bottom:none; }
      .summary-row span  { color:var(--color-text-muted); }
      .summary-row strong { font-weight:600; }
      .summary-totals { display:flex; flex-direction:column; gap:0; }
      .summary-total { padding-top:var(--space-4); }
      .checkout-confirm-details {
        background:var(--navy-50);border:1px solid var(--color-border);
        border-radius:var(--radius-lg);overflow:hidden;
      }
      .checkout-confirm-row {
        display:flex;justify-content:space-between;padding:var(--space-4) var(--space-5);
        border-bottom:1px solid var(--color-border-subtle);font-size:var(--text-sm);
        text-align:left;
      }
      .checkout-confirm-row:last-child { border-bottom:none; }
      .checkout-confirm-row span  { color:var(--color-text-muted); }
      .checkout-confirm-row strong{ font-weight:600; }
      .q-radio { width:22px;height:22px;border-radius:50%;border:2px solid var(--color-border);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all var(--ease-fast); }
      .q-radio-on { border-color:var(--color-brand);background:var(--color-brand); }
      .q-radio-dot { width:9px;height:9px;background:#fff;border-radius:50%; }
      @media(max-width:900px) { .checkout-layout { grid-template-columns:1fr; } .checkout-summary { order:-1; } }
      @media(max-width:640px) { .trust-strip { justify-content:center; gap:var(--space-4); } }
    `}</style>
  );
}

export default Checkout;
