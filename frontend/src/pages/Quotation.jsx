import { useState, useReducer, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useApiGet, useApiMutation } from '../hooks/useApi';
import { getServices, getExtras, postQuotation } from '../api/api';
import { formatCurrency, formatDate, formatPages } from '../utils/formatters';
import { isValidEmail, isValidPhone, isValidPages, isNotEmpty } from '../utils/validation';

/* ── Constants ── */
const DELIVERY_METHODS = [
  { value: 'Unidad física del cliente',          icon: '💾', label: 'Unidad física',       desc: 'USB o disco duro proporcionado por su empresa' },
  { value: 'Enlace temporal a nuestra nube',     icon: '☁️',  label: 'Enlace a la nube',    desc: 'Enlace seguro de descarga temporal (48h)' },
  { value: 'Transferencia a la nube del cliente',icon: '🔄', label: 'Nube del cliente',     desc: 'Google Drive / OneDrive / SharePoint' },
  { value: 'Servidor SFTP',                      icon: '🖥️', label: 'Servidor SFTP',        desc: 'Para infraestructura corporativa propia' },
  { value: 'Bóveda Digital Segura',              icon: '🔐', label: 'Bóveda Digital',       desc: 'Acceso 24/7 encriptado (solo Plan Premium)', premium: true },
];

const STEPS = [
  { id: 1, label: 'Empresa',   icon: '🏢' },
  { id: 2, label: 'Servicio',  icon: '📋' },
  { id: 3, label: 'Detalles',  icon: '⚙️' },
  { id: 4, label: 'Confirmar', icon: '✅' },
];

/* ── Reducer ── */
const INIT = { company_name: '', contact_name: '', email: '', phone: '', service_id: null, estimated_pages: '', pickup_date: '', delivery_method: '', extra_ids: [] };

function formReducer(state, { type, field, value, id }) {
  if (type === 'SET') return { ...state, [field]: value };
  if (type === 'TOGGLE_EXTRA') {
    const ids = state.extra_ids.includes(id)
      ? state.extra_ids.filter(x => x !== id)
      : [...state.extra_ids, id];
    return { ...state, extra_ids: ids };
  }
  if (type === 'RESET') return INIT;
  return state;
}

/* ── Per-step validation ── */
const STEP_FIELDS = {
  1: ['company_name', 'contact_name', 'email', 'phone'],
  2: ['service_id'],
  3: ['estimated_pages', 'pickup_date', 'delivery_method'],
};

function validateStep(step, form) {
  const e = {};
  if (step >= 1) {
    if (!isNotEmpty(form.company_name)) e.company_name = 'Nombre de empresa requerido';
    if (!isNotEmpty(form.contact_name)) e.contact_name = 'Nombre de contacto requerido';
    if (!isValidEmail(form.email))      e.email = 'Correo electrónico inválido';
    if (!isValidPhone(form.phone))      e.phone = 'Teléfono inválido (mínimo 10 dígitos)';
  }
  if (step >= 2) {
    if (!form.service_id) e.service_id = 'Selecciona un plan';
  }
  if (step >= 3) {
    if (!isValidPages(form.estimated_pages)) e.estimated_pages = 'Cantidad entre 1 y 999,999 páginas';
    if (!form.pickup_date)                   e.pickup_date = 'Selecciona la fecha de recolección';
    if (!isNotEmpty(form.delivery_method))   e.delivery_method = 'Selecciona un método de entrega';
  }
  return e;
}

/* ─────────── Sub-components ─────────── */

function StepIndicator({ current }) {
  return (
    <div className="q-stepper">
      {STEPS.map((step, i) => {
        const done   = step.id < current;
        const active = step.id === current;
        return (
          <div key={step.id} className={`q-step ${done ? 'q-done' : active ? 'q-active' : 'q-pending'}`}>
            <div className="q-step-circle">{done ? '✓' : step.icon}</div>
            <span className="q-step-label">{step.label}</span>
            {i < STEPS.length - 1 && <div className={`q-line ${done ? 'q-line-done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

function FieldError({ msg }) {
  return msg ? <span className="form-error">⚠ {msg}</span> : null;
}

function ServiceOption({ service, selected, onSelect }) {
  return (
    <div
      className={`svc-opt${selected ? ' svc-selected' : ''}${service.is_premium ? ' svc-premium' : ''}`}
      onClick={() => onSelect(service.id)}
      role="radio" aria-checked={selected} tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(service.id)}
    >
      {service.is_premium && <div className="svc-badge">⭐ Premium</div>}
      <div className="svc-header">
        <div className="svc-icon">{service.is_premium ? '🏆' : '📄'}</div>
        <div style={{ flex: 1 }}>
          <h3 className="svc-name">{service.name}</h3>
          <p className="svc-price">{formatCurrency(service.price_per_1000_pages)}<span>/1,000 páginas</span></p>
        </div>
        <div className={`q-radio${selected ? ' q-radio-on' : ''}`}>
          {selected && <div className="q-radio-dot" />}
        </div>
      </div>
      <p className="svc-desc">{service.description}</p>
      <div className="svc-meta">
        <span>⏱ {service.estimated_days} días hábiles</span>
        {service.is_premium && <span>🔐 Bóveda Digital incluida</span>}
      </div>
    </div>
  );
}

function DeliveryOption({ method, selected, disabled, onSelect }) {
  return (
    <div
      className={`del-opt${selected ? ' del-selected' : ''}${disabled ? ' del-disabled' : ''}`}
      onClick={() => !disabled && onSelect(method.value)}
      role="radio" aria-checked={selected} tabIndex={disabled ? -1 : 0}
      onKeyDown={e => e.key === 'Enter' && !disabled && onSelect(method.value)}
    >
      <span className="del-icon">{method.icon}</span>
      <div className="del-info">
        <strong>{method.label}</strong>
        <span>{method.desc}</span>
      </div>
      {disabled && <span className="badge badge-premium" style={{ marginLeft: 'auto', flexShrink: 0 }}>Premium</span>}
      <div className={`q-radio${selected ? ' q-radio-on' : ''}`} style={{ marginLeft: disabled ? 'var(--space-3)' : 'auto', flexShrink: 0 }}>
        {selected && <div className="q-radio-dot" />}
      </div>
    </div>
  );
}

function ExtraOption({ extra, selected, onToggle }) {
  return (
    <div
      className={`ext-opt${selected ? ' ext-selected' : ''}`}
      onClick={() => onToggle(extra.id)}
      role="checkbox" aria-checked={selected} tabIndex={0}
      onKeyDown={e => e.key === ' ' && onToggle(extra.id)}
    >
      <div className={`q-check${selected ? ' q-check-on' : ''}`}>{selected ? '✓' : ''}</div>
      <div className="ext-info">
        <strong>{extra.name}</strong>
        <span>{extra.description}</span>
        <div className="ext-pricing">
          {extra.price > 0       && <span className="ext-fixed">+{formatCurrency(extra.price)}</span>}
          {extra.percentage > 0  && <span className="ext-pct">+{extra.percentage}% s/subtotal</span>}
          {extra.reduces_delivery_days && <span className="badge badge-success">⚡ Más rápido</span>}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Main ─────────── */
function Quotation() {
  const [step, setStep]       = useState(1);
  const [form, dispatch]      = useReducer(formReducer, INIT);
  const [errors, setErrors]   = useState({});
  const [result, setResult]   = useState(null);

  const { data: services, loading: svcLoad } = useApiGet(getServices);
  const { data: extras,   loading: extLoad } = useApiGet(getExtras);
  const { execute: submit, loading: saving, error: submitErr } = useApiMutation(postQuotation);

  const selectedService = services?.find(s => s.id === form.service_id) ?? null;
  const isPremium       = selectedService?.is_premium ?? false;
  const today           = new Date().toISOString().split('T')[0];

  const set = useCallback((field, value) => {
    dispatch({ type: 'SET', field, value });
    setErrors(e => ({ ...e, [field]: undefined }));
  }, []);

  const goNext = () => {
    const errs   = validateStep(step, form);
    const fields = STEP_FIELDS[step] ?? [];
    const relevant = fields.reduce((acc, f) => { if (errs[f]) acc[f] = errs[f]; return acc; }, {});
    if (Object.keys(relevant).length) { setErrors(p => ({ ...p, ...relevant })); return; }
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    try {
      const data = await submit({
        company_name:    form.company_name,
        contact_name:    form.contact_name,
        email:           form.email,
        phone:           form.phone,
        service_id:      Number(form.service_id),
        estimated_pages: Number(form.estimated_pages),
        delivery_method: form.delivery_method,
        pickup_date:     form.pickup_date,
        extra_ids:       form.extra_ids,
      });
      setResult(data);
    } catch (_) {}
  };

  const reset = () => { dispatch({ type: 'RESET' }); setStep(1); setErrors({}); setResult(null); };

  /* Result screen */
  if (result) return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 720, paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-16)' }}>
        <div className="card card-body-lg" style={{ animation: 'fadeInScale 0.4s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🎉</div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-extrabold)', marginBottom: 'var(--space-2)' }}>
              ¡Cotización generada exitosamente!
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Cotización <strong>#{result.id}</strong> — revisa el resumen y confirma para continuar.
            </p>
          </div>

          <div className="q-result-table">
            {[
              ['Empresa',             result.company_name],
              ['Contacto',            result.contact_name],
              ['Páginas estimadas',   formatPages(result.estimated_pages)],
              ['Fecha recolección',   formatDate(result.pickup_date)],
              ['Entrega estimada',    formatDate(result.estimated_delivery_date)],
              ['Método de entrega',   result.delivery_method],
            ].map(([label, val]) => (
              <div className="q-result-row" key={label}>
                <span>{label}</span><strong>{val}</strong>
              </div>
            ))}
            <div className="divider" style={{ margin: 0 }} />
            <div className="q-result-row"><span>Subtotal digitalización</span><strong>{formatCurrency(result.subtotal)}</strong></div>
            {result.extras_total > 0 && (
              <div className="q-result-row"><span>Servicios adicionales</span><strong>{formatCurrency(result.extras_total)}</strong></div>
            )}
            <div className="q-result-row q-result-total">
              <span>Total estimado</span>
              <strong style={{ color: 'var(--color-brand)', fontSize: 'var(--text-2xl)' }}>{formatCurrency(result.total)}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-8)', flexWrap: 'wrap' }}>
            <Link to={`/checkout/${result.id}`} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
              Confirmar y pagar →
            </Link>
            <button onClick={reset} className="btn btn-outline btn-lg" style={{ flex: 1 }}>
              Nueva cotización
            </button>
          </div>
        </div>
      </div>
      <QuotationStyles />
    </div>
  );

  /* Form */
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <h1>Cotización instantánea</h1>
          <p>Obtén tu precio exacto en segundos. Sin compromisos, sin tarjeta de crédito.</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 800, paddingTop: 'var(--space-10)', paddingBottom: 'var(--space-16)' }}>
        <StepIndicator current={step} />

        <div className="card" style={{ marginTop: 'var(--space-10)' }}>
          <div className="card-body-lg">

            {step === 1 && (
              <div key="s1" style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 className="q-step-title">🏢 Información de la empresa</h2>
                <p className="q-step-sub">Esta información es confidencial y solo se usa para tu cotización.</p>
                <div className="grid grid-2" style={{ marginTop: 'var(--space-8)' }}>
                  {[
                    { field: 'company_name', label: 'Empresa',              placeholder: 'Ej. Cementos Argos S.A.', type: 'text' },
                    { field: 'contact_name', label: 'Nombre de contacto',   placeholder: 'Nombre completo',         type: 'text' },
                    { field: 'email',        label: 'Correo electrónico',    placeholder: 'correo@empresa.com',      type: 'email' },
                    { field: 'phone',        label: 'Teléfono',              placeholder: '3001234567',              type: 'tel', hint: 'Solo dígitos, sin espacios' },
                  ].map(({ field, label, placeholder, type, hint }) => (
                    <div className="form-group" key={field}>
                      <label className="form-label">{label} <span className="required">*</span></label>
                      <input
                        type={type}
                        className={`form-input${errors[field] ? ' is-invalid' : ''}`}
                        placeholder={placeholder}
                        value={form[field]}
                        onChange={e => set(field, type === 'tel' ? e.target.value.replace(/\D/g, '') : e.target.value)}
                        maxLength={type === 'tel' ? 15 : undefined}
                      />
                      <FieldError msg={errors[field]} />
                      {hint && <span className="form-hint">{hint}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div key="s2" style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 className="q-step-title">📋 Selecciona tu plan</h2>
                <p className="q-step-sub">Elige el plan que mejor se adapte a las necesidades de tu empresa.</p>
                {svcLoad ? (
                  <div className="spinner-wrapper"><div className="spinner" /></div>
                ) : (
                  <div className="svc-list" style={{ marginTop: 'var(--space-6)' }}>
                    {services?.map(s => (
                      <ServiceOption key={s.id} service={s} selected={form.service_id === s.id} onSelect={id => set('service_id', id)} />
                    ))}
                  </div>
                )}
                <FieldError msg={errors.service_id} />
              </div>
            )}

            {step === 3 && (
              <div key="s3" style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 className="q-step-title">⚙️ Detalles del servicio</h2>
                <p className="q-step-sub">Indícanos el volumen y coordina la fecha de recolección.</p>

                <div className="grid grid-2" style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
                  <div className="form-group">
                    <label className="form-label">Cantidad de páginas <span className="required">*</span></label>
                    <input
                      type="number" min={1} max={999999}
                      className={`form-input${errors.estimated_pages ? ' is-invalid' : ''}`}
                      placeholder="Ej. 5000"
                      value={form.estimated_pages}
                      onChange={e => set('estimated_pages', e.target.value)}
                    />
                    <FieldError msg={errors.estimated_pages} />
                    <span className="form-hint">📊 Estimado aproximado, ajustamos al final del proceso</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fecha de recolección <span className="required">*</span></label>
                    <input
                      type="date" min={today}
                      className={`form-input${errors.pickup_date ? ' is-invalid' : ''}`}
                      value={form.pickup_date}
                      onChange={e => set('pickup_date', e.target.value)}
                    />
                    <FieldError msg={errors.pickup_date} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-8)' }}>
                  <label className="form-label">Método de entrega <span className="required">*</span></label>
                  <div className="del-list">
                    {DELIVERY_METHODS.map(m => (
                      <DeliveryOption key={m.value} method={m} selected={form.delivery_method === m.value}
                        disabled={m.premium && !isPremium} onSelect={v => set('delivery_method', v)} />
                    ))}
                  </div>
                  <FieldError msg={errors.delivery_method} />
                </div>

                {extLoad ? (
                  <div className="spinner-wrapper" style={{ padding: 'var(--space-8)' }}><div className="spinner" /></div>
                ) : extras?.length > 0 && (
                  <div>
                    <p className="form-label" style={{ marginBottom: 'var(--space-4)' }}>
                      Servicios adicionales <span style={{ color: 'var(--color-text-muted)', fontWeight: 'normal' }}>(opcionales)</span>
                    </p>
                    <div className="ext-grid">
                      {extras.map(ex => (
                        <ExtraOption key={ex.id} extra={ex} selected={form.extra_ids.includes(ex.id)}
                          onToggle={id => dispatch({ type: 'TOGGLE_EXTRA', id })} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div key="s4" style={{ animation: 'fadeIn 0.3s ease' }}>
                <h2 className="q-step-title">✅ Confirmar cotización</h2>
                <p className="q-step-sub">Revisa los datos antes de solicitar tu precio final.</p>

                <div className="q-summary" style={{ marginTop: 'var(--space-6)' }}>
                  {[
                    { title: 'Contacto', rows: [['Empresa', form.company_name], ['Nombre', form.contact_name], ['Email', form.email], ['Teléfono', form.phone]] },
                    { title: 'Servicio', rows: [['Plan', selectedService?.name], ['Páginas', formatPages(form.estimated_pages)], ['Recolección', formatDate(form.pickup_date)], ['Entrega', form.delivery_method]] },
                  ].map(({ title, rows }) => (
                    <div className="q-summary-block" key={title}>
                      <h4>{title}</h4>
                      {rows.map(([k, v]) => (
                        <div className="q-summary-row" key={k}><span>{k}</span><strong>{v}</strong></div>
                      ))}
                    </div>
                  ))}

                  {form.extra_ids.length > 0 && (
                    <div className="q-summary-block">
                      <h4>Servicios adicionales</h4>
                      {extras?.filter(e => form.extra_ids.includes(e.id)).map(e => (
                        <div className="q-summary-row" key={e.id}>
                          <span>{e.name}</span>
                          <strong>{e.price > 0 ? formatCurrency(e.price) : ''}{e.percentage > 0 ? `+${e.percentage}%` : ''}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {submitErr && (
                  <div className="alert alert-error" style={{ marginTop: 'var(--space-6)' }}>
                    <span className="alert-icon">❌</span>
                    <div><strong>Error al procesar</strong><br />{submitErr}</div>
                  </div>
                )}
                <div className="alert alert-info" style={{ marginTop: 'var(--space-5)' }}>
                  <span className="alert-icon">ℹ️</span>
                  <div>El precio final se calcula según el volumen exacto verificado. La cotización no implica compromiso de pago.</div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="q-nav">
              {step > 1 && <button className="btn btn-outline btn-lg" onClick={goBack} disabled={saving}>← Anterior</button>}
              <div style={{ flex: 1 }} />
              {step < 4
                ? <button className="btn btn-primary btn-lg" onClick={goNext}>Siguiente →</button>
                : <button className="btn btn-success btn-lg" onClick={handleSubmit} disabled={saving}>
                    {saving ? <><div className="spinner spinner-sm" style={{ marginRight: 8 }} />Calculando...</> : '🚀 Obtener mi cotización'}
                  </button>
              }
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-5)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          Paso {step} de {STEPS.length} · 🔒 Tus datos están protegidos y son confidenciales
        </p>
      </div>
      <QuotationStyles />
    </div>
  );
}

/* Inline styles extracted to a component for readability */
function QuotationStyles() {
  return (
    <style>{`
      .q-stepper { display:flex; align-items:center; justify-content:center; padding: var(--space-6) 0 var(--space-10); }
      .q-step    { display:flex; align-items:center; position:relative; }
      .q-step-circle {
        width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;
        font-size:var(--text-lg);border:2px solid var(--color-border);background:var(--color-surface);
        transition:all var(--ease-base);z-index:1;flex-shrink:0;
      }
      .q-done   .q-step-circle { background:var(--color-success);border-color:var(--color-success);color:#fff;font-size:var(--text-base);font-weight:700; }
      .q-active .q-step-circle { background:var(--gradient-brand);border-color:var(--color-brand);color:#fff;box-shadow:var(--shadow-brand); }
      .q-step-label {
        position:absolute;top:50px;left:50%;transform:translateX(-50%);
        font-size:var(--text-xs);font-weight:600;white-space:nowrap;color:var(--color-text-muted);
      }
      .q-active .q-step-label { color:var(--color-brand); }
      .q-done   .q-step-label { color:var(--color-success); }
      .q-line      { width:72px;height:2px;background:var(--color-border);margin:0 4px;transition:background var(--ease-base); }
      .q-line-done { background:var(--color-success); }

      .q-step-title { font-size:var(--text-2xl);font-weight:800;margin-bottom:var(--space-2); }
      .q-step-sub   { font-size:var(--text-base);color:var(--color-text-secondary);line-height:var(--leading-relaxed); }

      /* Service options */
      .svc-list { display:flex;flex-direction:column;gap:var(--space-4); }
      .svc-opt {
        border:2px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-5);
        cursor:pointer;transition:all var(--ease-base);position:relative;background:var(--color-surface);
      }
      .svc-opt:hover { border-color:var(--indigo-300);box-shadow:var(--shadow-md); }
      .svc-selected  { border-color:var(--color-brand)!important;background:var(--indigo-50)!important;box-shadow:0 0 0 3px rgba(99,102,241,0.12)!important; }
      .svc-premium   { background:linear-gradient(145deg,#fff 0%,var(--indigo-50) 100%); }
      .svc-badge {
        position:absolute;top:-12px;right:var(--space-5);
        background:var(--gradient-premium);color:#fff;
        padding:3px var(--space-4);border-radius:var(--radius-full);
        font-size:var(--text-xs);font-weight:700;box-shadow:var(--shadow-brand);
      }
      .svc-header { display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-3); }
      .svc-icon { font-size:2rem;width:52px;height:52px;display:flex;align-items:center;justify-content:center;background:var(--indigo-100);border-radius:var(--radius-lg);flex-shrink:0; }
      .svc-name  { font-size:var(--text-lg);font-weight:700;margin-bottom:2px; }
      .svc-price { font-size:var(--text-xl);font-weight:800;color:var(--color-brand); }
      .svc-price span { font-size:var(--text-sm);color:var(--color-text-muted);font-weight:400; }
      .svc-desc  { font-size:var(--text-sm);color:var(--color-text-secondary);line-height:var(--leading-relaxed);margin-bottom:var(--space-3); }
      .svc-meta  { display:flex;gap:var(--space-6);font-size:var(--text-sm);color:var(--color-text-muted);font-weight:500; }

      /* Radio / check shared */
      .q-radio { width:22px;height:22px;border-radius:50%;border:2px solid var(--color-border);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all var(--ease-fast); }
      .q-radio-on { border-color:var(--color-brand);background:var(--color-brand); }
      .q-radio-dot { width:9px;height:9px;background:#fff;border-radius:50%; }
      .q-check { width:22px;height:22px;border-radius:var(--radius-sm);border:2px solid var(--color-border);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:var(--text-sm);font-weight:700;transition:all var(--ease-fast);color:#fff; }
      .q-check-on { background:var(--color-brand);border-color:var(--color-brand); }

      /* Delivery */
      .del-list { display:flex;flex-direction:column;gap:var(--space-3);margin-top:var(--space-3); }
      .del-opt  { display:flex;align-items:center;gap:var(--space-4);padding:var(--space-4) var(--space-5);border:1.5px solid var(--color-border);border-radius:var(--radius-lg);cursor:pointer;transition:all var(--ease-fast);background:var(--color-surface); }
      .del-opt:hover:not(.del-disabled) { border-color:var(--indigo-300);background:var(--indigo-50); }
      .del-selected  { border-color:var(--color-brand)!important;background:var(--indigo-50)!important;box-shadow:0 0 0 3px rgba(99,102,241,0.12)!important; }
      .del-disabled  { opacity:.5;cursor:not-allowed; }
      .del-icon { font-size:var(--text-2xl);flex-shrink:0; }
      .del-info { flex:1; }
      .del-info strong { font-size:var(--text-sm);font-weight:600;display:block; }
      .del-info span   { font-size:var(--text-xs);color:var(--color-text-muted); }

      /* Extras */
      .ext-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:var(--space-4); }
      .ext-opt  { display:flex;align-items:flex-start;gap:var(--space-4);padding:var(--space-4) var(--space-5);border:1.5px solid var(--color-border);border-radius:var(--radius-lg);cursor:pointer;transition:all var(--ease-fast); }
      .ext-opt:hover { border-color:var(--indigo-300);background:var(--indigo-50); }
      .ext-selected  { border-color:var(--color-brand)!important;background:var(--indigo-50)!important;box-shadow:0 0 0 3px rgba(99,102,241,0.12)!important; }
      .ext-info strong { font-size:var(--text-sm);font-weight:600;display:block;margin-bottom:2px; }
      .ext-info span   { font-size:var(--text-xs);color:var(--color-text-muted);line-height:var(--leading-relaxed); }
      .ext-pricing { display:flex;flex-wrap:wrap;gap:var(--space-2);margin-top:var(--space-3);align-items:center; }
      .ext-fixed { font-size:var(--text-sm);font-weight:700;color:var(--color-success); }
      .ext-pct   { font-size:var(--text-sm);font-weight:700;color:var(--amber-500); }

      /* Summary */
      .q-summary { display:flex;flex-direction:column;gap:var(--space-5); }
      .q-summary-block { background:var(--navy-50);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:var(--space-5); }
      .q-summary-block h4 { font-size:var(--text-xs);font-weight:700;color:var(--color-brand);text-transform:uppercase;letter-spacing:.07em;margin-bottom:var(--space-4); }
      .q-summary-row { display:flex;justify-content:space-between;padding:var(--space-2) 0;border-bottom:1px solid var(--color-border-subtle);font-size:var(--text-sm); }
      .q-summary-row:last-child { border-bottom:none; }
      .q-summary-row span { color:var(--color-text-muted); }
      .q-summary-row strong { color:var(--color-text-primary);font-weight:600; }

      /* Result */
      .q-result-table { border:1px solid var(--color-border);border-radius:var(--radius-lg);overflow:hidden; }
      .q-result-row { display:flex;justify-content:space-between;padding:var(--space-4) var(--space-5);border-bottom:1px solid var(--color-border-subtle);font-size:var(--text-sm); }
      .q-result-row:last-child { border-bottom:none; }
      .q-result-row span { color:var(--color-text-muted); }
      .q-result-row strong { font-weight:600; }
      .q-result-total { background:var(--indigo-50); }

      /* Nav */
      .q-nav { display:flex;align-items:center;gap:var(--space-4);margin-top:var(--space-10);padding-top:var(--space-6);border-top:1px solid var(--color-border); }

      @media (max-width:640px) {
        .q-line { width:36px; }
        .ext-grid { grid-template-columns:1fr; }
        .q-nav { flex-direction:column-reverse; }
        .q-nav .btn { width:100%; }
      }
    `}</style>
  );
}

export default Quotation;
