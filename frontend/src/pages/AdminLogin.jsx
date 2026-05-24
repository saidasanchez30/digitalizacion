import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const from = location.state?.from?.pathname ?? '/admin-demo';

  /* Si ya está autenticado, redirige directamente */
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Completa todos los campos');
      return;
    }
    setLoading(true);
    setError('');

    /* Simulamos latencia de red para UX realista */
    await new Promise(r => setTimeout(r, 600));

    const result = login(username, password);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background decorativo */}
      <div className="login-bg">
        <div className="login-bg-glow login-bg-glow-1" />
        <div className="login-bg-glow login-bg-glow-2" />
      </div>

      <div className="login-card">
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="login-brand-icon">⚙️</div>
          <div>
            <h1 className="login-brand-name">Panel de Administración</h1>
            <p className="login-brand-sub">DocDigitalPro · Acceso restringido</p>
          </div>
        </div>

        <div className="login-divider" />

        {/* Aviso de seguridad */}
        <div className="login-security-notice">
          <span>🔒</span>
          <p>Esta área es exclusiva para administradores autorizados. El acceso no autorizado está prohibido y puede ser sancionado.</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Usuario administrador
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              className={`form-input${error ? ' is-invalid' : ''}`}
              placeholder="admin"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <div className="login-password-wrapper">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                className={`form-input login-password-input${error ? ' is-invalid' : ''}`}
                placeholder="••••••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                disabled={loading}
              />
              <button
                type="button"
                className="login-toggle-pass"
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{ padding: 'var(--space-3) var(--space-4)' }}>
              <span className="alert-icon" style={{ fontSize: 'var(--text-base)' }}>❌</span>
              <span style={{ fontSize: 'var(--text-sm)' }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: 'var(--space-2)' }}
          >
            {loading ? (
              <>
                <div className="spinner spinner-sm" />
                Verificando...
              </>
            ) : (
              '🔐 Ingresar al panel'
            )}
          </button>
        </form>

        <p className="login-footer">
          ¿Eres cliente? <a href="/" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>Vuelve al inicio →</a>
        </p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-hero);
          padding: var(--space-6);
          position: relative;
          overflow: hidden;
        }

        .login-bg { position: absolute; inset: 0; pointer-events: none; }
        .login-bg-glow {
          position: absolute;
          border-radius: 50%;
          background: rgba(99,102,241,0.18);
          filter: blur(80px);
        }
        .login-bg-glow-1 { width: 500px; height: 500px; top: -120px; left: -100px; }
        .login-bg-glow-2 { width: 400px; height: 400px; bottom: -100px; right: -80px; background: rgba(139,92,246,0.15); }

        .login-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.97);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: var(--radius-2xl);
          padding: var(--space-10);
          box-shadow: 0 24px 64px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2);
          animation: fadeInScale 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }
        .login-brand-icon {
          width: 52px; height: 52px;
          background: var(--gradient-brand);
          border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.75rem;
          box-shadow: var(--shadow-brand);
          flex-shrink: 0;
        }
        .login-brand-name {
          font-size: var(--text-lg);
          font-weight: var(--font-extrabold);
          color: var(--color-text-primary);
          letter-spacing: -0.02em;
        }
        .login-brand-sub {
          font-size: var(--text-xs);
          color: var(--color-text-muted);
          margin-top: 2px;
          font-weight: var(--font-medium);
        }

        .login-divider {
          height: 1px;
          background: var(--color-border);
          margin: 0 0 var(--space-5);
        }

        .login-security-notice {
          display: flex;
          gap: var(--space-3);
          align-items: flex-start;
          padding: var(--space-3) var(--space-4);
          background: var(--amber-100);
          border: 1px solid rgba(245,158,11,0.25);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-6);
        }
        .login-security-notice span { font-size: var(--text-base); flex-shrink: 0; margin-top: 1px; }
        .login-security-notice p    { font-size: var(--text-xs); color: #92400E; line-height: var(--leading-relaxed); }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }

        .login-password-wrapper {
          position: relative;
        }
        .login-password-input { padding-right: 48px; }
        .login-toggle-pass {
          position: absolute;
          right: var(--space-3);
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: var(--text-lg);
          cursor: pointer;
          padding: var(--space-1);
          line-height: 1;
          opacity: 0.6;
          transition: opacity var(--ease-fast);
        }
        .login-toggle-pass:hover { opacity: 1; }

        .login-footer {
          margin-top: var(--space-6);
          text-align: center;
          font-size: var(--text-sm);
          color: var(--color-text-muted);
        }

        @media (max-width: 480px) {
          .login-card { padding: var(--space-8) var(--space-6); }
        }
      `}</style>
    </div>
  );
}

export default AdminLogin;
