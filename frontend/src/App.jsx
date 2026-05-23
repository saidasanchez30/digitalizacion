import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Componentes
import Navbar from './components/Navbar';

// Páginas
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Quotation from './pages/Quotation';
import Checkout from './pages/Checkout';
import Tracking from './pages/Tracking';
import Vault from './pages/Vault';
import AdminDemo from './pages/AdminDemo';

function App() {
  return (
    <Router>
      <div id="root">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/quotation" element={<Quotation />} />
            <Route path="/checkout/:quotationId" element={<Checkout />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/admin-demo" element={<AdminDemo />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
