import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const USERS = [
  { id: 10, username: 'chef', password: '1234', role: 'chef', name: 'Chef Marco' },
  { id: 11, username: 'chef2', password: '1234', role: 'chef', name: 'Chef Rosa' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('chef_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.role === 'chef') setUser(parsed);
      }
    } catch { localStorage.removeItem('chef_auth'); }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const found = USERS.find((u) => u.username === username && u.password === password);
    if (!found) return { success: false, error: 'Invalid credentials' };
    if (found.role !== 'chef') return { success: false, error: 'Access denied. Chef role required.' };
    const session = { id: found.id, username: found.username, role: found.role, name: found.name };
    setUser(session);
    localStorage.setItem('chef_auth', JSON.stringify(session));
    return { success: true };
  };

  const logout = () => { setUser(null); localStorage.removeItem('chef_auth'); };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
