import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">📄 Digitalización</div>
        <ul className="navbar-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/catalog">Catálogo</Link></li>
          <li><Link to="/quotation">Cotizar</Link></li>
          <li><Link to="/tracking">Seguimiento</Link></li>
          <li><Link to="/vault">Bóveda</Link></li>
          <li><Link to="/admin-demo">Admin</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
