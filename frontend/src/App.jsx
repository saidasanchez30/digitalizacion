import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import { AuthProvider }    from './context/AuthContext';
import ProtectedRoute      from './components/ProtectedRoute';
import Navbar              from './components/Navbar';

import Home       from './pages/Home';
import Catalog    from './pages/Catalog';
import Quotation  from './pages/Quotation';
import Checkout   from './pages/Checkout';
import Tracking   from './pages/Tracking';
import Vault      from './pages/Vault';
import AdminDemo  from './pages/AdminDemo';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/"                      element={<Home />} />
          <Route path="/catalog"               element={<Catalog />} />
          <Route path="/quotation"             element={<Quotation />} />
          <Route path="/checkout/:quotationId" element={<Checkout />} />
          <Route path="/tracking"              element={<Tracking />} />
          <Route path="/vault"                 element={<Vault />} />

          {/* Login del panel admin */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Ruta protegida — requiere autenticación */}
          <Route
            path="/admin-demo"
            element={
              <ProtectedRoute>
                <AdminDemo />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
