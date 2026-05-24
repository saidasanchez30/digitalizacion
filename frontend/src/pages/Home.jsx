import { Link } from 'react-router-dom';

const STATS = [
  { value: '+2M',   label: 'Páginas digitalizadas' },
  { value: '+500',  label: 'Empresas activas' },
  { value: '99.8%', label: 'Precisión OCR' },
  { value: '7 días',label: 'Entrega Premium' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '💬',
    title: 'Solicita tu cotización',
    desc: 'Completa el formulario en menos de 3 minutos. Indica el volumen de documentos y recibe un precio al instante.',
  },
  {
    step: '02',
    icon: '🚚',
    title: 'Recolección programada',
    desc: 'Coordinamos la visita a tus instalaciones. Nuestro equipo recoge los documentos con total seguridad y garantía.',
  },
  {
    step: '03',
    icon: '⚡',
    title: 'Digitalización profesional',
    desc: 'Escaneado de alta resolución, aplicación de OCR y control de calidad. Cada página verificada individualmente.',
  },
  {
    step: '04',
    icon: '✅',
    title: 'Entrega y acceso digital',
    desc: 'Recibe tus archivos organizados. Con el plan Premium, accede a tu bóveda digital 24/7 desde cualquier lugar.',
  },
];

const FEATURES = [
  { icon: '🔐', title: 'Seguridad garantizada',    desc: 'Todos los documentos se procesan bajo estrictos protocolos de seguridad. Encriptación de extremo a extremo en el plan Premium.' },
  { icon: '⚡', title: 'Rapidez sin precedentes',  desc: 'Tecnología de escaneado masivo. Procesamos hasta 500,000 páginas por semana para cumplir tus plazos.' },
  { icon: '🔍', title: 'OCR de alta precisión',    desc: 'Reconocimiento óptico de caracteres en español con 99.8% de precisión. Documentos completamente buscables.' },
  { icon: '📂', title: 'Indexación inteligente',   desc: 'Clasificación automática por tipo, categoría, departamento y nivel de confidencialidad.' },
  { icon: '📋', title: 'Cumplimiento legal',        desc: 'Ajustado a la Ley 527 de 1999 y normativas de gestión documental en Colombia. Habeas Data garantizado.' },
  { icon: '🎯', title: 'Seguimiento en tiempo real',desc: 'Monitorea el estado de tu orden en cada etapa del proceso desde nuestra plataforma.' },
];

const PLANS = [
  {
    name: 'Estándar',
    price: '$15.000',
    unit: 'por 1,000 páginas',
    badge: null,
    color: 'standard',
    days: '10 días hábiles',
    features: [
      '✅ Escaneo a alta resolución',
      '✅ Control de calidad manual',
      '✅ Entrega en unidad física o enlace',
      '✅ Seguimiento de orden en línea',
      '✅ Soporte técnico incluido',
      '❌ Bóveda Digital segura',
      '❌ OCR incluido',
    ],
    cta: 'Cotizar plan Estándar',
  },
  {
    name: 'Premium',
    price: '$25.000',
    unit: 'por 1,000 páginas',
    badge: '⭐ Más popular',
    color: 'premium',
    days: '7 días hábiles',
    features: [
      '✅ Escaneo a alta resolución',
      '✅ Control de calidad manual',
      '✅ Todos los métodos de entrega',
      '✅ Seguimiento de orden en línea',
      '✅ Soporte prioritario 24/7',
      '✅ Bóveda Digital encriptada',
      '✅ OCR y búsqueda de texto',
    ],
    cta: 'Cotizar plan Premium',
  },
];

const TRUST_BADGES = [
  { icon: '🛡️', label: 'ISO 27001' },
  { icon: '📋', label: 'Habeas Data' },
  { icon: '🔒', label: 'SSL / TLS' },
  { icon: '⚖️',  label: 'Ley 527/99' },
  { icon: '🏆', label: '10+ años' },
];

function StatItem({ value, label }) {
  return (
    <div className="hero-stat">
      <span className="hero-stat-value">{value}</span>
      <span className="hero-stat-label">{label}</span>
    </div>
  );
}

function Home() {
  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-bg-glow" />
        <div className="container hero-content">
          <div className="hero-text">
            <div className="pill pill-light" style={{ marginBottom: 'var(--space-6)', width: 'fit-content' }}>
              🚀 La solución #1 en digitalización documental empresarial
            </div>
            <h1 className="hero-title">
              Convierte tus archivos<br />
              <span className="hero-title-accent">físicos en activos digitales</span>
            </h1>
            <p className="hero-desc">
              Digitalización profesional, segura y escalable para empresas colombianas.
              Desde documentos básicos hasta expedientes completos con bóveda digital encriptada.
            </p>
            <div className="hero-actions">
              <Link to="/quotation" className="btn btn-primary btn-xl">
                Obtener cotización gratis →
              </Link>
              <Link to="/catalog" className="btn btn-ghost-white btn-lg">
                Ver planes y precios
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-doc-stack">
              <div className="doc-float doc-float-1">
                <span>📄</span>
                <div>
                  <strong>Contrato_2024.pdf</strong>
                  <small>Digitalizado · OCR ✓</small>
                </div>
              </div>
              <div className="doc-float doc-float-2">
                <span>📊</span>
                <div>
                  <strong>Factura_Q4.xlsx</strong>
                  <small>En bóveda · Encriptado</small>
                </div>
              </div>
              <div className="doc-float doc-float-3">
                <span>📋</span>
                <div>
                  <strong>Expediente_HR.pdf</strong>
                  <small>Indexado · Búsqueda ✓</small>
                </div>
              </div>
              <div className="hero-doc-center">
                <div className="hero-doc-icon">📂</div>
                <p>Bóveda Digital</p>
                <small>+12,450 documentos</small>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="container">
          <div className="hero-stats">
            {STATS.map(s => <StatItem key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="trust-section">
        <div className="container">
          <p className="trust-label">Cumplimos con los más altos estándares de seguridad y legalidad</p>
          <div className="trust-badges">
            {TRUST_BADGES.map(b => (
              <div className="trust-badge" key={b.label}>
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="pill pill-brand" style={{ marginBottom: 'var(--space-4)', width: 'fit-content', margin: '0 auto var(--space-4)' }}>
              Proceso simple
            </div>
            <h2 className="section-title">¿Cómo funciona?</h2>
            <p className="section-subtitle">
              De la solicitud a la entrega en 4 pasos. Sin complicaciones, sin contratos largos.
            </p>
          </div>

          <div className="steps-grid">
            {HOW_IT_WORKS.map((step, i) => (
              <div className="step-card" key={step.step}>
                <div className="step-connector" />
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="section plans-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Planes diseñados para tu empresa</h2>
            <p className="section-subtitle">
              Precios transparentes, sin sorpresas. Escala según el volumen de tu empresa.
            </p>
          </div>

          <div className="plans-grid">
            {PLANS.map(plan => (
              <div key={plan.name} className={`plan-card ${plan.color === 'premium' ? 'plan-card-premium' : ''}`}>
                {plan.badge && <div className="plan-badge">{plan.badge}</div>}
                <div className="plan-header">
                  <h3 className="plan-name">Plan {plan.name}</h3>
                  <div className="plan-price">
                    <span className="plan-price-value">{plan.price}</span>
                    <span className="plan-price-unit">{plan.unit}</span>
                  </div>
                  <div className="plan-days">
                    ⏱ Entrega en {plan.days}
                  </div>
                </div>
                <ul className="plan-features">
                  {plan.features.map(f => (
                    <li key={f} className={f.startsWith('❌') ? 'unavailable' : ''}>{f}</li>
                  ))}
                </ul>
                <Link
                  to="/quotation"
                  className={`btn btn-full btn-lg ${plan.color === 'premium' ? 'btn-primary' : 'btn-outline'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">¿Por qué elegirnos?</h2>
            <p className="section-subtitle">
              Tecnología, seguridad y experiencia al servicio de tu empresa.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map(f => (
              <div className="feature-card card card-body" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="cta-section">
        <div className="cta-bg-glow" />
        <div className="container cta-content">
          <h2 className="cta-title">¿Listo para digitalizar<br />tu empresa?</h2>
          <p className="cta-desc">
            Obtén tu cotización personalizada en menos de 3 minutos. Sin compromisos, sin tarjeta de crédito.
          </p>
          <div className="cta-actions">
            <Link to="/quotation" className="btn btn-primary btn-xl">
              Comenzar ahora — es gratis →
            </Link>
            <Link to="/catalog" className="btn btn-ghost-white btn-lg">
              Ver catálogo completo
            </Link>
          </div>
          <p className="cta-note">
            🔒 Tus datos están protegidos. No compartimos información con terceros.
          </p>
        </div>
      </section>

      <style>{`
        /* ── Hero ── */
        .hero-section {
          background: var(--gradient-hero);
          padding: var(--space-20) 0 var(--space-16);
          position: relative;
          overflow: hidden;
          color: #fff;
        }
        .hero-bg-glow {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 600px;
          background: radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-16);
          align-items: center;
          padding-bottom: var(--space-16);
          position: relative;
        }
        .hero-title {
          font-size: var(--text-5xl);
          font-weight: var(--font-extrabold);
          line-height: var(--leading-tight);
          letter-spacing: -0.03em;
          margin-bottom: var(--space-6);
        }
        .hero-title-accent {
          background: linear-gradient(135deg, #818CF8 0%, #C4B5FD 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-desc {
          font-size: var(--text-lg);
          color: rgba(255,255,255,0.72);
          line-height: var(--leading-relaxed);
          margin-bottom: var(--space-8);
          max-width: 520px;
        }
        .hero-actions {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        /* Hero visual */
        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hero-doc-stack {
          position: relative;
          width: 320px;
          height: 320px;
        }
        .hero-doc-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          text-align: center;
          width: 160px;
        }
        .hero-doc-icon { font-size: 3rem; margin-bottom: var(--space-2); }
        .hero-doc-center p { font-weight: var(--font-bold); font-size: var(--text-sm); }
        .hero-doc-center small { font-size: var(--text-xs); color: rgba(255,255,255,0.6); }
        .doc-float {
          position: absolute;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius-lg);
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-xs);
          white-space: nowrap;
          box-shadow: var(--shadow-lg);
        }
        .doc-float span { font-size: var(--text-xl); }
        .doc-float strong { display: block; font-weight: var(--font-semibold); font-size: var(--text-sm); }
        .doc-float small  { color: rgba(255,255,255,0.6); }
        .doc-float-1 { top: 10px;  left: -20px; animation: float 3.2s ease-in-out infinite; }
        .doc-float-2 { top: 120px; right: -30px; animation: float 3.8s ease-in-out infinite 0.5s; }
        .doc-float-3 { bottom: 20px; left: -10px; animation: float 3.5s ease-in-out infinite 1s; }

        /* Stats */
        .hero-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-xl);
          padding: var(--space-6) var(--space-8);
        }
        .hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-1);
          text-align: center;
        }
        .hero-stat-value {
          font-size: var(--text-3xl);
          font-weight: var(--font-extrabold);
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fff 0%, #A5B4FC 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-stat-label {
          font-size: var(--text-xs);
          color: rgba(255,255,255,0.55);
          font-weight: var(--font-medium);
        }

        /* ── Trust ── */
        .trust-section {
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          padding: var(--space-6) 0;
          background: var(--color-surface);
        }
        .trust-label {
          text-align: center;
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          margin-bottom: var(--space-5);
          font-weight: var(--font-medium);
        }
        .trust-badges {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--space-8);
          flex-wrap: wrap;
        }
        .trust-badge {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--navy-600);
        }
        .trust-badge span:first-child { font-size: var(--text-xl); }

        /* ── Steps ── */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-6);
          position: relative;
        }
        .step-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-4);
          padding: var(--space-8) var(--space-5);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          position: relative;
          transition: box-shadow var(--ease-base), transform var(--ease-base);
        }
        .step-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
          border-color: var(--indigo-300);
        }
        .step-number {
          font-size: var(--text-xs);
          font-weight: var(--font-extrabold);
          letter-spacing: 0.1em;
          color: var(--color-brand);
          background: var(--indigo-100);
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-full);
        }
        .step-icon {
          font-size: 2.5rem;
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--indigo-50);
          border-radius: var(--radius-xl);
          border: 1px solid var(--indigo-100);
        }
        .step-title {
          font-size: var(--text-base);
          font-weight: var(--font-bold);
          color: var(--color-text-primary);
        }
        .step-desc {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          line-height: var(--leading-relaxed);
        }

        /* ── Plans ── */
        .plans-section { background: var(--navy-50); }
        .plans-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
          max-width: 900px;
          margin: 0 auto;
        }
        .plan-card {
          background: var(--color-surface);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          position: relative;
          transition: box-shadow var(--ease-base), transform var(--ease-base);
        }
        .plan-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }
        .plan-card-premium {
          border-color: var(--indigo-400);
          background: linear-gradient(145deg, #fff 0%, var(--indigo-50) 100%);
          box-shadow: var(--shadow-brand);
        }
        .plan-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--gradient-brand);
          color: #fff;
          padding: var(--space-2) var(--space-5);
          border-radius: var(--radius-full);
          font-size: var(--text-sm);
          font-weight: var(--font-bold);
          white-space: nowrap;
          box-shadow: var(--shadow-brand);
        }
        .plan-name {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--color-text-primary);
        }
        .plan-price {
          display: flex;
          align-items: baseline;
          gap: var(--space-2);
          margin: var(--space-2) 0;
        }
        .plan-price-value {
          font-size: var(--text-4xl);
          font-weight: var(--font-extrabold);
          letter-spacing: -0.03em;
          color: var(--color-brand);
        }
        .plan-price-unit {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
        }
        .plan-days {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          font-weight: var(--font-medium);
        }
        .plan-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          flex: 1;
        }
        .plan-features li {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          padding: var(--space-2) 0;
          border-bottom: 1px solid var(--color-border-subtle);
        }
        .plan-features li:last-child { border-bottom: none; }
        .plan-features li.unavailable { color: var(--color-text-muted); }

        /* ── Features ── */
        .features-section { background: var(--color-bg); }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-5);
        }
        .feature-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          transition: box-shadow var(--ease-base), transform var(--ease-base);
        }
        .feature-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
        .feature-icon {
          font-size: 2rem;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--indigo-100);
          border-radius: var(--radius-lg);
        }
        .feature-title {
          font-size: var(--text-base);
          font-weight: var(--font-bold);
          color: var(--color-text-primary);
        }
        .feature-desc {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          line-height: var(--leading-relaxed);
        }

        /* ── Final CTA ── */
        .cta-section {
          background: var(--gradient-hero);
          padding: var(--space-24) 0;
          text-align: center;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .cta-bg-glow {
          position: absolute;
          bottom: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, transparent 70%);
        }
        .cta-content { position: relative; }
        .cta-title {
          font-size: var(--text-5xl);
          font-weight: var(--font-extrabold);
          letter-spacing: -0.03em;
          line-height: var(--leading-tight);
          margin-bottom: var(--space-6);
        }
        .cta-desc {
          font-size: var(--text-lg);
          color: rgba(255,255,255,0.7);
          max-width: 520px;
          margin: 0 auto var(--space-10);
          line-height: var(--leading-relaxed);
        }
        .cta-actions {
          display: flex;
          justify-content: center;
          gap: var(--space-4);
          flex-wrap: wrap;
          margin-bottom: var(--space-8);
        }
        .cta-note {
          font-size: var(--text-sm);
          color: rgba(255,255,255,0.5);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .hero-content { grid-template-columns: 1fr; text-align: center; }
          .hero-visual { display: none; }
          .hero-title { font-size: var(--text-4xl); }
          .hero-actions { justify-content: center; }
          .hero-stats { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: 1fr; }
          .plans-grid { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: 1fr; }
          .cta-title { font-size: var(--text-3xl); }
          .hero-stat-value { font-size: var(--text-2xl); }
        }
      `}</style>
    </div>
  );
}

export default Home;
