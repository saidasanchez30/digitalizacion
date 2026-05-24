import { createContext, useContext, useState, useCallback } from 'react';

/* ── Credenciales admin (en producción esto vendría del backend) ── */
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'DocDigital2024!',
};

const SESSION_KEY = 'dd_admin_session';

/* ── Helpers de sesión ── */
function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    /* Expira después de 8 horas */
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function saveSession(user) {
  const session = {
    user,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 h
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

/* ── Context ── */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadSession());

  const isAuthenticated = session !== null;
  const currentUser     = session?.user ?? null;

  const login = useCallback((username, password) => {
    if (
      username.trim() === ADMIN_CREDENTIALS.username &&
      password         === ADMIN_CREDENTIALS.password
    ) {
      const s = saveSession({ username, role: 'admin' });
      setSession(s);
      return { ok: true };
    }
    return { ok: false, error: 'Usuario o contraseña incorrectos' };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
