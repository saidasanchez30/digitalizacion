import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Middleware de ruta — redirige al login si el usuario no está autenticado.
 * Preserva la ruta original en `location.state.from` para redirigir
 * de vuelta después del login.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
