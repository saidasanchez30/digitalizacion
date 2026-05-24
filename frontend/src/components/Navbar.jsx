import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',         label: 'Inicio',      icon: '🏠' },
  { to: '/catalog',  label: 'Catálogo',    icon: '📋' },
  { to: '/tracking', label: 'Seguimiento', icon: '🔍' },
  { to: '/vault',    label: 'Bóveda',      icon: '🔐' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">📄</div>
          DocDigital<span>Pro</span>
        </Link>

        <ul className="navbar-links">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => isActive ? 'active' : ''}
                end={to === '/'}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar-cta">
          <Link to="/quotation" className="btn btn-primary btn-sm">
            Cotizar ahora →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menú"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            padding: '4px 8px',
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? 'active' : ''}
              end={to === '/'}
            >
              <span>{icon}</span> {label}
            </NavLink>
          ))}
          <Link
            to="/quotation"
            className="btn btn-primary btn-full"
            onClick={() => setMenuOpen(false)}
          >
            Cotizar ahora →
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .navbar-links, .navbar-cta { display: none !important; }
          .navbar-hamburger { display: block !important; }
        }
        .navbar-mobile-menu {
          position: absolute;
          top: 72px;
          left: 0;
          right: 0;
          background: rgba(2, 8, 24, 0.98);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: fadeIn 0.2s ease;
        }
        .navbar-mobile-menu a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 10px;
          color: rgba(255,255,255,0.8);
          font-size: 0.9375rem;
          font-weight: 500;
          transition: background 0.15s;
        }
        .navbar-mobile-menu a:hover,
        .navbar-mobile-menu a.active {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
