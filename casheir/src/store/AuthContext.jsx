import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pos_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role === 'cashier') {
          setUser(parsed);
        }
      }
    } catch {
      localStorage.removeItem('pos_auth');
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await authAPI.login(username, password);
      const userData = res.data;
      setUser(userData);
      localStorage.setItem('pos_auth', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pos_auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
